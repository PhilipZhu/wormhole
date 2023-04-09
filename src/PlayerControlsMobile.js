"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var three_1 = require("three");
var PlayerControls_1 = require("./PlayerControls");
var MathUtils_1 = require("./MathUtils");
var q0 = new three_1.Quaternion();
var minusPiOverTwoAroundX = new three_1.Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2); // - PI/2 around the x-axis
var PlayerControlsTouch = /** @class */ (function (_super) {
    __extends(PlayerControlsTouch, _super);
    function PlayerControlsTouch(player, domElement) {
        var _this = _super.call(this, player) || this;
        _this.domElement = domElement;
        _this.currentTouches = {};
        _this.velocityTouches = {};
        _this.screenOrientation = 0;
        _this.forwardSpeed = 0;
        _this.rotationSpeedX = 0;
        _this.onContextMenu = _this.onContextMenu.bind(_this);
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchMove = _this.onTouchMove.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onScreenOrientationChange = _this.onScreenOrientationChange.bind(_this);
        _this.onDeviceOrientationChange = _this.onDeviceOrientationChange.bind(_this);
        return _this;
    }
    PlayerControlsTouch.prototype.onEnable = function () {
        this.currentTouches = {};
        this.velocityTouches = {};
        this.forwardSpeed = 0;
        this.rotationSpeedX = 0;
        this.domElement.addEventListener('contextmenu', this.onContextMenu, false);
        this.domElement.addEventListener('touchstart', this.onTouchStart, false);
        this.domElement.addEventListener('touchmove', this.onTouchMove, false);
        this.domElement.addEventListener('touchend', this.onTouchEnd, false);
        this.domElement.addEventListener('touchcancel', this.onTouchEnd, false);
    };
    PlayerControlsTouch.prototype.onDisable = function () {
        this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
        this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
        this.domElement.removeEventListener('touchmove', this.onTouchMove, false);
        this.domElement.removeEventListener('touchend', this.onTouchEnd, false);
        this.domElement.removeEventListener('touchcancel', this.onTouchEnd, false);
    };
    PlayerControlsTouch.prototype.requestFreeMovement = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission)) return [3 /*break*/, 2];
                        return [4 /*yield*/, window.DeviceOrientationEvent.requestPermission()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        window.addEventListener('orientationchange', this.onScreenOrientationChange, false);
                        window.addEventListener('deviceorientation', this.onDeviceOrientationChange, false);
                        this.freeMovement = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    PlayerControlsTouch.prototype.stopFreeMovement = function () {
        window.removeEventListener('orientationchange', this.onScreenOrientationChange, false);
        window.removeEventListener('deviceorientation', this.onDeviceOrientationChange, false);
        this.freeMovement = false;
    };
    PlayerControlsTouch.prototype.onContextMenu = function (event) {
        event.preventDefault();
    };
    PlayerControlsTouch.prototype.onTouchStart = function (event) {
        // Preventing default behavior so that the user doesn't accidentally scroll the viewport
        event.preventDefault();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            this.currentTouches[touch.identifier] = {
                start: {
                    x: touch.clientX,
                    y: touch.clientY
                },
                previous: {
                    x: touch.clientX,
                    y: touch.clientY
                },
                current: {
                    x: touch.clientX,
                    y: touch.clientY
                }
            };
        }
    };
    PlayerControlsTouch.prototype.setRotationSpeed = function (touch) {
        var touchInfo = this.currentTouches[touch.identifier];
        var cameraFovX = 2 * Math.atan(Math.tan(this.player.eyes.fov * three_1.MathUtils.DEG2RAD * 0.5) * this.player.eyes.aspect);
        this.rotationSpeedX = cameraFovX * (touchInfo.current.x - touchInfo.previous.x) / this.domElement.clientWidth;
    };
    PlayerControlsTouch.prototype.addVelocityTouch = function (touch) {
        var touchInfo = this.currentTouches[touch.identifier];
        this.forwardSpeed = 4 * (touchInfo.current.y - touchInfo.start.y) / this.domElement.clientHeight;
        this.velocityTouches[touch.identifier] = true;
    };
    PlayerControlsTouch.prototype.removeVelocityTouch = function (touch) {
        delete this.velocityTouches[touch.identifier];
        if (Object.keys(this.velocityTouches).length === 0) {
            this.forwardSpeed = 0;
        }
    };
    PlayerControlsTouch.prototype.onTouchMove = function (event) {
        for (var touch = void 0, touchInfo = void 0, i = 0; i < event.changedTouches.length; i++) {
            touch = event.changedTouches[i];
            touchInfo = this.currentTouches[touch.identifier];
            touchInfo.previous = touchInfo.current;
            touchInfo.current = {
                x: touch.clientX,
                y: touch.clientY
            };
            var dxTotal = touchInfo.current.x - touchInfo.start.x;
            var dyTotal = touchInfo.current.y - touchInfo.start.y;
            if (Math.abs(dxTotal) > Math.abs(dyTotal)) {
                this.setRotationSpeed(touch);
                // This touch is no longer moving the player forward
                this.removeVelocityTouch(touch);
            }
            else {
                this.addVelocityTouch(touch);
            }
        }
    };
    PlayerControlsTouch.prototype.onTouchEnd = function (event) {
        for (var touch = void 0, i = 0; i < event.changedTouches.length; i++) {
            touch = event.changedTouches[i];
            delete this.currentTouches[touch.identifier];
            this.removeVelocityTouch(touch);
        }
    };
    PlayerControlsTouch.prototype.onDeviceOrientationChange = function (event) {
        this.deviceOrientation = event;
    };
    PlayerControlsTouch.prototype.onScreenOrientationChange = function () {
        this.screenOrientation = Number(window.orientation) || 0;
    };
    PlayerControlsTouch.prototype.updateEyeOrientation = function () {
        if (!this.deviceOrientation || this.deviceOrientation.alpha === null) {
            return;
        }
        var alpha = this.deviceOrientation.alpha ? three_1.MathUtils.DEG2RAD * this.deviceOrientation.alpha : 0;
        var beta = this.deviceOrientation.beta ? three_1.MathUtils.DEG2RAD * this.deviceOrientation.beta : 0;
        var gamma = this.deviceOrientation.gamma ? three_1.MathUtils.DEG2RAD * this.deviceOrientation.gamma : 0;
        var orient = this.screenOrientation ? three_1.MathUtils.DEG2RAD * this.screenOrientation : 0;
        var euler = new three_1.Euler(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
        this.player.eyes.quaternion.setFromEuler(euler); // orient the device
        this.player.eyes.quaternion.multiply(minusPiOverTwoAroundX); // camera looks out the back of the device, not the top
        this.player.eyes.quaternion.multiply(q0.setFromAxisAngle(MathUtils_1.UnitZ, -orient)); // adjust for screen orientation
    };
    PlayerControlsTouch.prototype.updateOrientation = function (delta) {
        var player = this.player;
        var movementVector = new three_1.Vector3(this.rotationSpeedX, 0, 1);
        movementVector.normalize();
        player.quaternion.multiply(q0.setFromUnitVectors(MathUtils_1.UnitZ, movementVector));
        this.rotationSpeedX -= 4 * this.rotationSpeedX * delta;
        if (this.freeMovement) {
            this.updateEyeOrientation();
        }
    };
    PlayerControlsTouch.prototype.updateVelocity = function (delta) {
        this.velocity
            .set(0, 0, this.forwardSpeed)
            .applyQuaternion(this.player.eyes.getWorldQuaternion(q0));
    };
    return PlayerControlsTouch;
}(PlayerControls_1.PlayerControls));
exports.PlayerControlsTouch = PlayerControlsTouch;
