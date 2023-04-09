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
exports.__esModule = true;
var three_1 = require("three");
var PlayerControls_1 = require("./PlayerControls");
var MathUtils_1 = require("./MathUtils");
var PlayerControlsKeyboard = /** @class */ (function (_super) {
    __extends(PlayerControlsKeyboard, _super);
    function PlayerControlsKeyboard(player, domElement) {
        var _this = _super.call(this, player) || this;
        _this.domElement = domElement;
        _this.moveForward = false;
        _this.moveBackward = false;
        _this.moveLeft = false;
        _this.moveRight = false;
        _this.moveUp = false;
        _this.moveDown = false;
        _this.rotateLeft = false;
        _this.rotateRight = false;
        _this.rotationSpeedX = 0;
        _this.rotationSpeedY = 0;
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onKeyUp = _this.onKeyUp.bind(_this);
        return _this;
    }
    PlayerControlsKeyboard.prototype.onEnable = function () {
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.rotateLeft = false;
        this.rotateRight = false;
        this.rotationSpeedX = 0;
        this.rotationSpeedY = 0;
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    };
    PlayerControlsKeyboard.prototype.onDisable = function () {
        document.removeEventListener('mousemove', this.onMouseMove, false);
        document.removeEventListener('keydown', this.onKeyDown, false);
        document.removeEventListener('keyup', this.onKeyUp, false);
    };
    PlayerControlsKeyboard.prototype.updateOrientation = function (delta) {
        // Update camera roll/pitch etc
        this.rotationSpeedX -= 4 * this.rotationSpeedX * delta;
        this.rotationSpeedY -= 4 * this.rotationSpeedY * delta;
        var movementVector = new three_1.Vector3(this.rotationSpeedX * delta, -this.rotationSpeedY * delta, 100.0);
        movementVector.normalize();
        var rotation = new three_1.Quaternion();
        rotation.setFromUnitVectors(MathUtils_1.UnitZ, movementVector);
        this.player.quaternion.multiply(rotation);
        if (this.freeMovement) {
            if (this.rotateLeft) {
                rotation.setFromAxisAngle(MathUtils_1.UnitZ, delta);
                this.player.quaternion.multiply(rotation);
            }
            if (this.rotateRight) {
                rotation.setFromAxisAngle(MathUtils_1.UnitZ, -delta);
                this.player.quaternion.multiply(rotation);
            }
        }
    };
    PlayerControlsKeyboard.prototype.updateVelocity = function (delta) {
        var targetVelocity = new three_1.Vector3();
        if (this.moveForward) {
            targetVelocity.add(MathUtils_1.UnitZNeg);
        }
        if (this.moveBackward) {
            targetVelocity.add(MathUtils_1.UnitZ);
        }
        if (this.moveLeft) {
            targetVelocity.add(MathUtils_1.UnitXNeg);
        }
        if (this.moveRight) {
            targetVelocity.add(MathUtils_1.UnitX);
        }
        if (this.freeMovement) {
            if (this.moveUp) {
                targetVelocity.add(MathUtils_1.UnitY);
            }
            if (this.moveDown) {
                targetVelocity.add(MathUtils_1.UnitYNeg);
            }
        }
        if (targetVelocity.lengthSq() > 0) {
            targetVelocity.normalize().applyQuaternion(this.player.quaternion);
        }
        this.velocity.lerp(targetVelocity, 1 - Math.exp(-delta * 10));
    };
    PlayerControlsKeyboard.prototype.onMouseMove = function (e) {
        if (document.pointerLockElement !== this.domElement) {
            return;
        }
        this.rotationSpeedX -= 4 * (e.movementX || 0);
        if (this.freeMovement) {
            this.rotationSpeedY -= 4 * (e.movementY || 0);
        }
    };
    PlayerControlsKeyboard.prototype.onKeyDown = function (e) {
        switch (e.keyCode) {
            case 37:
            case 65:
                this.moveLeft = true;
                break;
            case 39:
            case 68:
                this.moveRight = true;
                break;
            case 38:
            case 87:
                this.moveForward = true;
                break;
            case 40:
            case 83:
                this.moveBackward = true;
                break;
            case 82:
                this.moveUp = true;
                break;
            case 70:
                this.moveDown = true;
                break;
            case 81:
                this.rotateLeft = true;
                break;
            case 69:
                this.rotateRight = true;
                break;
        }
    };
    PlayerControlsKeyboard.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case 37:
            case 65:
                this.moveLeft = false;
                break;
            case 39:
            case 68:
                this.moveRight = false;
                break;
            case 38:
            case 87:
                this.moveForward = false;
                break;
            case 40:
            case 83:
                this.moveBackward = false;
                break;
            case 82:
                this.moveUp = false;
                break;
            case 70:
                this.moveDown = false;
                break;
            case 81:
                this.rotateLeft = false;
                break;
            case 69:
                this.rotateRight = false;
                break;
        }
    };
    return PlayerControlsKeyboard;
}(PlayerControls_1.PlayerControls));
exports.PlayerControlsKeyboard = PlayerControlsKeyboard;
