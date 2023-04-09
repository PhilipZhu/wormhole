"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var XRControllerModelFactory_1 = require("three/examples/jsm/webxr/XRControllerModelFactory");
var Action_1 = require("./Action");
var factory = new XRControllerModelFactory_1.XRControllerModelFactory();
var VrController = /** @class */ (function () {
    function VrController(xr, index) {
        this.disconnectAction = new Action_1.Action();
        this.previousAxes = [];
        this.triggerPressed = false;
        this.controller = xr.getController(index);
        this.onSelectStart = this.onSelectStart.bind(this);
        this.onSelectEnd = this.onSelectEnd.bind(this);
        this.onControllerConnect = this.onControllerConnect.bind(this);
        this.onControllerDisconnect = this.onControllerDisconnect.bind(this);
        this.controller.addEventListener('selectstart', this.onSelectStart);
        this.controller.addEventListener('selectend', this.onSelectEnd);
        this.controller.addEventListener('connected', this.onControllerConnect);
        this.controller.addEventListener('disconnected', this.onControllerDisconnect);
        this.grip = xr.getControllerGrip(index);
        this.grip.add(factory.createControllerModel(this.grip));
    }
    VrController.prototype["delete"] = function () {
        this.controller.removeEventListener('selectstart', this.onSelectStart);
        this.controller.removeEventListener('selectend', this.onSelectEnd);
        this.controller.removeEventListener('connected', this.onControllerConnect);
        this.controller.removeEventListener('disconnected', this.onControllerDisconnect);
    };
    VrController.prototype.update = function () {
        if (!this.gamepad) {
            return;
        }
        this.previousAxes = __spreadArrays(this.gamepad.axes);
    };
    VrController.prototype.onControllerConnect = function (e) {
        if (!e.data.gamepad) {
            return;
        }
        this.gamepad = e.data.gamepad;
    };
    VrController.prototype.onControllerDisconnect = function (e) {
        if (!e.data.gamepad) {
            return;
        }
        this.disconnectAction.dispatch(undefined);
    };
    VrController.prototype.onSelectStart = function (e) {
        this.triggerPressed = true;
    };
    VrController.prototype.onSelectEnd = function (e) {
        this.triggerPressed = false;
    };
    return VrController;
}());
exports.VrController = VrController;
