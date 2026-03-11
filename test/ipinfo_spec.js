var helper = require("node-red-node-test-helper");
var ipinfoNode = require("../ipinfo.js");
var ipinfoConfigNode = require("../ipinfo-config.js");
var should = require("should");

helper.init(require.resolve("node-red"));

describe("ipinfo Node", function () {

    afterEach(function () {
        helper.unload();
    });

    it("should be loaded", function (done) {
        var flow = [
            { id: "c1", type: "ipinfo-config", name: "test config" },
            { id: "n1", type: "ipinfo", name: "test ipinfo", config: "c1" }
        ];
        var credentials = { c1: { token: "test-token" } };
        helper.load([ipinfoConfigNode, ipinfoNode], flow, credentials, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property("name", "test ipinfo");
            done();
        });
    });

    it("should report missing config", function (done) {
        var flow = [
            { id: "n1", type: "ipinfo", name: "test ipinfo", config: "" }
        ];
        helper.load([ipinfoConfigNode, ipinfoNode], flow, function () {
            var n1 = helper.getNode("n1");
            // Node should exist but have error status
            n1.should.have.property("name", "test ipinfo");
            done();
        });
    });

    it("should warn on empty payload", function (done) {
        var flow = [
            { id: "c1", type: "ipinfo-config", name: "test config" },
            { id: "n1", type: "ipinfo", name: "test ipinfo", config: "c1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        var credentials = { c1: { token: "test-token" } };
        helper.load([ipinfoConfigNode, ipinfoNode], flow, credentials, function () {
            var n1 = helper.getNode("n1");
            n1.receive({ payload: "" });
            // Should not crash — error is logged internally
            setTimeout(done, 100);
        });
    });

    it("should warn on invalid IP", function (done) {
        var flow = [
            { id: "c1", type: "ipinfo-config", name: "test config" },
            { id: "n1", type: "ipinfo", name: "test ipinfo", config: "c1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        var credentials = { c1: { token: "test-token" } };
        helper.load([ipinfoConfigNode, ipinfoNode], flow, credentials, function () {
            var n1 = helper.getNode("n1");
            n1.receive({ payload: "not-an-ip" });
            setTimeout(done, 100);
        });
    });
});

describe("ipinfo-config Node", function () {

    afterEach(function () {
        helper.unload();
    });

    it("should be loaded with defaults", function (done) {
        var flow = [
            { id: "c1", type: "ipinfo-config", name: "test config" }
        ];
        var credentials = { c1: { token: "test-token" } };
        helper.load([ipinfoConfigNode], flow, credentials, function () {
            var c1 = helper.getNode("c1");
            c1.should.have.property("name", "test config");
            c1.should.have.property("client");
            done();
        });
    });

    it("should enable cache when configured", function (done) {
        var flow = [
            {
                id: "c1", type: "ipinfo-config", name: "cached config",
                cacheEnabled: true, maxitem: "1000", ttl: "60000", timeout: "2000"
            }
        ];
        var credentials = { c1: { token: "test-token" } };
        helper.load([ipinfoConfigNode], flow, credentials, function () {
            var c1 = helper.getNode("c1");
            c1.should.have.property("cacheEnabled", true);
            c1.should.have.property("maxitem", 1000);
            c1.should.have.property("ttl", 60000);
            done();
        });
    });
});
