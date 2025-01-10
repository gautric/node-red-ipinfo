
const { IPinfoWrapper } = require("node-ipinfo");


module.exports = function(RED) {
    function IPInfoConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.timeout = n.timeout;
        var token = this.credentials.token;
        this.client = new IPinfoWrapper(token, undefined, this.timeout);        
    }

    RED.nodes.registerType("ipinfo-config",IPInfoConfigNode,{
        credentials: {
            token: {type:"password"}
        }
    });
}