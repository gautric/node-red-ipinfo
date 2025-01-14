
const { IPinfoWrapper, LruCache } = require("node-ipinfo");


module.exports = function(RED) {
    function IPInfoConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.timeout = n.timeout;
        this.cacheEnabled = n.cacheEnabled;
        this.maxitem = n.maxitem;
        this.ttl = n.ttl;

        var token = this.credentials.token;
        var cache = undefined
        
        if(n.cacheEnabled){
            const cacheOptions = {
                max: parseInt(this.maxitem),  // 5000
                ttl: parseInt(this.ttl), // 24 * 1000 * 60 * 60
            };
            //console.log("Cache enabled with options: ", JSON.stringify(cacheOptions));
            cache = new LruCache(cacheOptions);
        }

        this.client = new IPinfoWrapper(token, cache, this.timeout);        
    }

    RED.nodes.registerType("ipinfo-config",IPInfoConfigNode,{
        credentials: {
            token: {type:"password"}
        }
    });
}