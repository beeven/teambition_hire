
/*

*/

module.exports = {
    hook: function(fnName, obj) {


        var proto = this.prototype || this,
            before = proto._before = proto._before || {},
            after = proto._after = proto._after || {};
        before[fnName] = before[fnName] || [];
        after[fnName] = after[fnName] || [];

        proto[name] = function() {
            var self = this;
            var originArgs = arguments;
        };

    }

}
