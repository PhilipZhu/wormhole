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
function wrapText(ctx, text, x, y, lineWidth, lineHeight) {
    var line = '';
    var paragraphs = text.split('\n');
    for (var i = 0; i < paragraphs.length; i++) {
        var words = paragraphs[i].split(' ');
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > lineWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = '';
    }
}
var q1 = new three_1.Quaternion();
var v1 = new three_1.Vector3();
var VRInstructions = /** @class */ (function (_super) {
    __extends(VRInstructions, _super);
    function VRInstructions(player) {
        var _this = _super.call(this) || this;
        _this.player = player;
        _this.resetPosition = true;
        var canvas = document.createElement('canvas');
        canvas.width = 1000;
        var ctx = canvas.getContext('2d');
        ctx.font = '48px -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.beginPath();
        wrapText(ctx, 'Press the trigger button to move yourself towards the controller.', canvas.width / 2, 50, canvas.width, 50);
        _this.material = new three_1.MeshBasicMaterial({
            map: new three_1.CanvasTexture(canvas),
            color: 0xffffff,
            transparent: true,
            side: three_1.DoubleSide
        });
        _this.mesh = new three_1.Mesh(new three_1.PlaneBufferGeometry(canvas.width / canvas.height * 2, 2), _this.material);
        _this.material.opacity = _this.targetOpacity = 0;
        _this.add(_this.mesh);
        _this.mesh.position.set(0, 0, -10);
        return _this;
    }
    VRInstructions.prototype.hide = function () {
        this.targetOpacity = 0;
    };
    VRInstructions.prototype.show = function () {
        this.resetPosition = true;
        this.targetOpacity = 1;
    };
    VRInstructions.prototype.update = function (delta) {
        this.player.eyes.getWorldPosition(v1);
        this.player.eyes.getWorldQuaternion(q1);
        var amount = this.resetPosition ? 1 : 1 - Math.exp(-delta);
        this.position.lerp(v1, amount);
        this.quaternion.slerp(q1, amount);
        this.material.opacity += (this.targetOpacity - this.material.opacity) * (1 - Math.exp(-delta * 10));
        this.resetPosition = false;
    };
    return VRInstructions;
}(three_1.Object3D));
exports.VRInstructions = VRInstructions;
