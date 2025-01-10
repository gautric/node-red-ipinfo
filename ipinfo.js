
const { IPinfoWrapper } = require("node-ipinfo");

//const { TokenConfigNode } = require("token-config");


console.log("IPInfo Node-RED module loaded");

module.exports = function(RED) {

    function IPInfoNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        this.property = config.property || "payload";
        this.propertyout = config.propertyout || "payload";

        var ipinfoconfig = RED.nodes.getNode(config.config);


        node.on('input', function(msg,nodeSend,nodeDone) {
            
            var value = RED.util.getMessageProperty(msg,node.property);

            node.status({fill:"blue",shape:"dot",text:"ipinfo.status.lookupip"});

            ipinfoconfig.client.lookupIp(value).then((result) => {
                console.log("IPInfo: " + JSON.stringify(result));
                setTimeout(() => node.status({}), 250);
                RED.util.setMessageProperty(msg,node.propertyout,result);
                nodeSend(msg);
                nodeDone();      
            }).catch((err) => {
                console.log("Error: " + JSON.stringify(err));
                node.status({fill:"red",shape:"dot",text:"ipinfo.status.error"});
                node.error(err);
                nodeDone();
            });

        });
    }
    RED.nodes.registerType("ipinfo",IPInfoNode);
}
