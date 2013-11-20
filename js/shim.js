// iOS 6.0- 与 android 4.0- 版本未实现 Function.prototype.bind
// ES5 Mobile兼容表: https://github.com/AlloyTeam/Mars/blob/master/tools/es5-mobile-compat-table.md
define(function(){
    // Inspired by https://github.com/kriskowal/es5-shim
    // Copyright 2009-2012 by contributors, MIT License
    if (!Function.prototype.bind) {
        function Empty() {}
        var _Array_slice_ = Array.prototype.slice;
        Function.prototype.bind = function bind(that) {
            var target = this;
            if (typeof target != "function") {
                throw new TypeError("Function.prototype.bind called on incompatible " + target);
            }
            var args = _Array_slice_.call(arguments, 1);
            var bound = function () {
                if (this instanceof bound) {
                    var result = target.apply(
                        this,
                        args.concat(_Array_slice_.call(arguments))
                    );
                    if (Object(result) === result) {
                        return result;
                    }
                    return this;
                } else {
                    return target.apply(
                        that,
                        args.concat(_Array_slice_.call(arguments))
                    );
                }
            };
            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                Empty.prototype = null;
            }
            return bound;
        };
    }
})