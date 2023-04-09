"use strict";
exports.__esModule = true;
var Action = /** @class */ (function () {
    function Action() {
        this.listeners = new Set();
    }
    Action.prototype.addListener = function (listener) {
        this.listeners.add(listener);
    };
    Action.prototype.removeListener = function (listener) {
        this.listeners["delete"](listener);
    };
    Action.prototype.dispatch = function (event) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var func = _a[_i];
            func(event);
        }
    };
    return Action;
}());
exports.Action = Action;
