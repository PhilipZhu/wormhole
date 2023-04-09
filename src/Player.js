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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(space) {
        var _this = _super.call(this) || this;
        _this.space = space;
        _this.eyes = new three_1.PerspectiveCamera(60, 1, 0.1, 100);
        _this.add(_this.eyes);
        return _this;
    }
    Player.prototype.move = function (velocity) {
        var distance = velocity.length();
        velocity = velocity.clone().normalize();
        this.space.move(this, velocity, distance);
    };
    return Player;
}(three_1.Object3D));
exports.Player = Player;
