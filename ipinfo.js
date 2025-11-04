const { IPinfoWrapper } = require("node-ipinfo");

/**
 * Node-RED module for retrieving IP geolocation information using IPInfo service
 * 
 * @module IPInfoNode
 * @description A Node-RED node that allows looking up geolocation details for a given IP address
 * @requires node-ipinfo
 */
module.exports = function(RED) {

    /**
     * Creates an IPInfo node for Node-RED
     * 
     * @constructor
     * @param {Object} config - Configuration object for the IPInfo node
     * @param {string} [config.property="payload"] - Input message property containing the IP address
     * @param {string} [config.propertyout="payload"] - Output message property to store IP geolocation information
     * @param {Object} config.config - Reference to the IPInfo configuration node
     */
    function IPInfoNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        // Set input and output properties, defaulting to 'payload'
        this.property = config.property || "payload";
        this.propertyout = config.propertyout || "payload";

        // Get the IPInfo configuration node
        var ipinfoconfig = RED.nodes.getNode(config.config);

        // Validate configuration node exists
        if (!ipinfoconfig) {
            node.error(RED._("ipinfo.errors.missing-config"));
            node.status({fill:"red", shape:"ring", text:"ipinfo.status.missing-config"});
            return;
        }

        /**
         * Validates if a string is a valid IP address (IPv4 or IPv6)
         * @param {string} ip - The IP address to validate
         * @returns {boolean} - True if valid IP address
         */
        function isValidIP(ip) {
            if (!ip || typeof ip !== 'string') {
                return false;
            }
            
            // IPv4 pattern
            const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            // IPv6 pattern (simplified)
            const ipv6Pattern = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
            
            return ipv4Pattern.test(ip) || ipv6Pattern.test(ip) || ip === 'me';
        }

        /**
         * Handles incoming messages and performs IP lookup
         * 
         * @param {Object} msg - The incoming Node-RED message
         * @param {Function} nodeSend - Function to send the modified message
         * @param {Function} nodeDone - Function to signal message processing completion
         */
        node.on('input', function(msg, nodeSend, nodeDone) {
            
            // Extract IP address from the specified input property
            var value = RED.util.getMessageProperty(msg, node.property);

            // Validate input
            if (value === undefined || value === null) {
                node.error(RED._("ipinfo.errors.no-ip"), msg);
                node.status({fill:"red", shape:"ring", text:"ipinfo.status.no-ip"});
                nodeDone();
                return;
            }

            // Convert to string if needed
            value = String(value).trim();

            // Validate IP address format
            if (!isValidIP(value)) {
                node.warn(RED._("ipinfo.errors.invalid-ip", {ip: value}));
                node.status({fill:"yellow", shape:"ring", text:"ipinfo.status.invalid-ip"});
                nodeDone();
                return;
            }

            // Set node status to indicate IP lookup in progress
            node.status({fill:"blue", shape:"dot", text:"ipinfo.status.lookupip"});
            node.debug(RED._("ipinfo.debug.lookup-start", {ip: value}));

            // Perform IP geolocation lookup
            ipinfoconfig.client.lookupIp(value).then((result) => {
                node.debug(RED._("ipinfo.debug.lookup-success", {ip: value}));
                
                // Clear status on successful lookup
                node.status({});
                
                // Set the result in the specified output property
                try {
                    RED.util.setMessageProperty(msg, node.propertyout, result);
                    nodeSend(msg);
                    nodeDone();
                } catch(err) {
                    node.error(RED._("ipinfo.errors.property-error", {error: err.message}), msg);
                    node.status({fill:"red", shape:"ring", text:"ipinfo.status.error"});
                    nodeDone(err);
                }
            }).catch((err) => {
                // Handle any errors during IP lookup
                node.error(RED._("ipinfo.errors.lookup-failed", {error: err.message}), msg);
                node.status({fill:"red", shape:"dot", text:"ipinfo.status.error"});
                
                // Pass error to nodeDone for proper error propagation
                nodeDone(err);
            });
        });

        /**
         * Cleanup on node close
         */
        node.on('close', function() {
            node.status({});
        });
    }

    // Register the IPInfo node type with Node-RED
    RED.nodes.registerType("ipinfo", IPInfoNode);
}
