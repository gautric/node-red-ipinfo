const { IPinfoWrapper, LruCache } = require("node-ipinfo");

/**
 * Node-RED configuration module for IPInfo service.
 *
 * @module IPInfoConfigNode
 * @description Manages configuration and client creation for IPInfo geolocation lookups.
 * @requires node-ipinfo
 */
module.exports = function (RED) {
    /**
     * Creates a configuration node for the IPInfo service.
     *
     * @constructor
     * @param {Object} n - Configuration parameters
     * @param {string}  n.name         - Display name of the configuration node
     * @param {number}  n.timeout      - Timeout for API requests in milliseconds
     * @param {boolean} n.cacheEnabled - Whether to cache IP lookup results
     * @param {number}  n.maxitem      - Maximum number of items in the LRU cache
     * @param {number}  n.ttl          - Time-to-live for cached items in milliseconds
     */
    function IPInfoConfigNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;

        // Store configuration parameters
        this.name = n.name;
        this.timeout = parseInt(n.timeout, 10) || 1000;
        this.cacheEnabled = n.cacheEnabled;
        this.maxitem = parseInt(n.maxitem, 10) || 5000;
        this.ttl = parseInt(n.ttl, 10) || 86400000; // 24h default

        // Retrieve the authentication token from credentials
        var token = this.credentials ? this.credentials.token : undefined;

        if (!token) {
            node.warn(RED._("ipinfo.errors.missing-token"));
        }

        var cache;

        // Configure LRU cache if caching is enabled
        if (n.cacheEnabled) {
            var cacheOptions = {
                max: this.maxitem,
                ttl: this.ttl
            };
            cache = new LruCache(cacheOptions);
            node.debug("Cache enabled — max: " + this.maxitem + ", ttl: " + this.ttl + "ms");
        }

        // Create the IPInfo client with token, optional cache, and timeout
        this.client = new IPinfoWrapper(token, cache, this.timeout);

        // Cleanup on node close
        node.on("close", function () {
            node.debug("IPInfo config node closed");
            // Allow garbage collection of the client
            node.client = null;
        });
    }

    // Register the IPInfo configuration node type with Node-RED
    RED.nodes.registerType("ipinfo-config", IPInfoConfigNode, {
        credentials: {
            token: { type: "password" }
        }
    });
};
