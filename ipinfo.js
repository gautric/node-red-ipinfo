const { IPinfoWrapper } = require("node-ipinfo");

/**
 * Node-RED module for retrieving IP geolocation information using the IPInfo service.
 *
 * @module IPInfoNode
 * @description A Node-RED node that looks up geolocation details for a given IP address.
 * @requires node-ipinfo
 */
module.exports = function (RED) {
    // Pre-compiled regex patterns for IP validation (avoids re-creation per call)
    var IPV4_RE = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    var IPV6_RE = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d))$/;

    /**
     * Validates whether a string is a valid IP address (IPv4, IPv6) or the
     * special "me" keyword supported by the IPInfo API.
     *
     * @param {string} ip - The IP address to validate
     * @returns {boolean} True when the value is a valid lookup target
     */
    function isValidIP(ip) {
        if (!ip || typeof ip !== "string") {
            return false;
        }
        return ip === "me" || IPV4_RE.test(ip) || IPV6_RE.test(ip);
    }

    /**
     * Creates an IPInfo node for Node-RED.
     *
     * @constructor
     * @param {Object} config - Node configuration
     * @param {string} [config.property="payload"]    - Input message property containing the IP
     * @param {string} [config.propertyout="payload"] - Output message property for the result
     * @param {Object} config.config                  - Reference to the IPInfo configuration node
     */
    function IPInfoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Input / output property names, defaulting to "payload"
        this.property = config.property || "payload";
        this.propertyout = config.propertyout || "payload";

        // Resolve the shared configuration node
        var ipinfoconfig = RED.nodes.getNode(config.config);

        if (!ipinfoconfig) {
            node.error(RED._("ipinfo.errors.missing-config"));
            node.status({ fill: "red", shape: "ring", text: "ipinfo.status.missing-config" });
            return;
        }

        /**
         * Handles incoming messages and performs IP lookup.
         */
        node.on("input", function (msg, nodeSend, nodeDone) {
            // Extract IP address from the specified input property
            var value = RED.util.getMessageProperty(msg, node.property);

            // Validate input exists
            if (value === undefined || value === null || value === "") {
                node.error(RED._("ipinfo.errors.no-ip"), msg);
                node.status({ fill: "red", shape: "ring", text: "ipinfo.status.no-ip" });
                if (nodeDone) { nodeDone(); }
                return;
            }

            // Coerce to trimmed string
            value = String(value).trim();

            // Validate IP address format
            if (!isValidIP(value)) {
                node.warn(RED._("ipinfo.errors.invalid-ip", { ip: value }));
                node.status({ fill: "yellow", shape: "ring", text: "ipinfo.status.invalid-ip" });
                if (nodeDone) { nodeDone(); }
                return;
            }

            // Indicate lookup in progress
            node.status({ fill: "blue", shape: "dot", text: "ipinfo.status.lookupip" });
            node.debug(RED._("ipinfo.debug.lookup-start", { ip: value }));

            // Perform IP geolocation lookup
            ipinfoconfig.client.lookupIp(value).then(function (result) {
                node.debug(RED._("ipinfo.debug.lookup-success", { ip: value }));
                node.status({});

                try {
                    RED.util.setMessageProperty(msg, node.propertyout, result);
                    nodeSend(msg);
                    if (nodeDone) { nodeDone(); }
                } catch (err) {
                    node.error(RED._("ipinfo.errors.property-error", { error: err.message }), msg);
                    node.status({ fill: "red", shape: "ring", text: "ipinfo.status.error" });
                    if (nodeDone) { nodeDone(err); }
                }
            }).catch(function (err) {
                node.error(RED._("ipinfo.errors.lookup-failed", { error: err.message }), msg);
                node.status({ fill: "red", shape: "dot", text: "ipinfo.status.error" });
                if (nodeDone) { nodeDone(err); }
            });
        });

        /**
         * Cleanup on node close.
         */
        node.on("close", function () {
            node.status({});
        });
    }

    // Register the IPInfo node type with Node-RED
    RED.nodes.registerType("ipinfo", IPInfoNode);
};
