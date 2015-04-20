

var should = require("should");

describe("hook",function(){
    it("should support hooking on Function",function(){
        var Hook = require("../lib/hook");
        var i = 0;
        var func = function(){i++;};
        Hook(func,function(){i++;},function(){i++;});
        func();
        i.should.be.exactly(3);
    });
});
