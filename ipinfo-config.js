const { IPinfoWrapper, LruCache } = require("node-ipinfo");

/**
 * Node-RED configuration module for IPInfo service
 * 
 * @module IPInfoConfigNode
 * @description Manages configuration and client creation for IPInfo geolocation lookups
 * @requires node-ipinfo
 */
module.exports = function(RED) {
    /**
     * Creates a configuration node for IPInfo service
     * 
     * @constructor
     * @param {Object} n - Configuration parameters for the IPInfo node
     * @param {string} n.name - Name of the configuration node
     * @param {number} n.timeout - Timeout for API requests in milliseconds
     * @param {boolean} n.cacheEnabled - Flag to enable/disable caching of IP lookup results
     * @param {number} n.maxitem - Maximum number of items to store in the cache
     * @param {number} n.ttl - Time-to-live for cached items in milliseconds
     */
    function IPInfoConfigNode(n) {
        // Create the Node-RED node
        RED.nodes.createNode(this,n);

        // Store configuration parameters
        this.name = n.name;
        this.timeout = n.timeout;
        this.cacheEnabled = n.cacheEnabled;
        this.maxitem = n.maxitem;
        this.ttl = n.ttl;

        // Retrieve the authentication token from credentials
        var token = this.credentials.token;
        var cache = undefined;
        
        // Configure LRU cache if caching is enabled
        if(n.cacheEnabled){
            // Create cache configuration options
            const cacheOptions = {
                max: parseInt(this.maxitem),  // Maximum number of cached items
                ttl: parseInt(this.ttl),      // Time-to-live for cached items
            };
            
            // Initialize the LRU cache
            cache = new LruCache(cacheOptions);
        }

        // Create the IPInfo client with token, optional cache, and timeout
        this.client = new IPinfoWrapper(token, cache, this.timeout);        
    }

    // Register the IPInfo configuration node type with Node-RED
    RED.nodes.registerType("ipinfo-config", IPInfoConfigNode, {
        // Define credentials schema
        credentials: {
            // Token is a sensitive password field
            token: {type:"password"}
        }
    });
}
