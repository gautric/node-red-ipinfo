const { IPinfoWrapper } = require("node-ipinfo");

console.log("IPInfo Node-RED module loaded");

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

        /**
         * Handles incoming messages and performs IP lookup
         * 
         * @param {Object} msg - The incoming Node-RED message
         * @param {Function} nodeSend - Function to send the modified message
         * @param {Function} nodeDone - Function to signal message processing completion
         */
        node.on('input', function(msg,nodeSend,nodeDone) {
            
            // Extract IP address from the specified input property
            var value = RED.util.getMessageProperty(msg,node.property);

            // Set node status to indicate IP lookup in progress
            node.status({fill:"blue",shape:"dot",text:"ipinfo.status.lookupip"});

            // Perform IP geolocation lookup
            ipinfoconfig.client.lookupIp(value).then((result) => {
                console.log("IPInfo: " + JSON.stringify(result));
                
                // Clear status after a short delay
                setTimeout(() => node.status({}), 250);
                
                // Set the result in the specified output property
                RED.util.setMessageProperty(msg,node.propertyout,result);
                
                // Send the modified message
                nodeSend(msg);
                nodeDone();      
            }).catch((err) => {
                // Handle any errors during IP lookup
                console.log("Error: " + JSON.stringify(err));
                
                // Set error status
                node.status({fill:"red",shape:"dot",text:"ipinfo.status.error"});
                
                // Report the error
                node.error(err);
                nodeDone();
            });
        });
    }

    // Register the IPInfo node type with Node-RED
    RED.nodes.registerType("ipinfo",IPInfoNode);
}
