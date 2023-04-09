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
var WormholeGeometry = /** @class */ (function (_super) {
    __extends(WormholeGeometry, _super);
    function WormholeGeometry(space, min, max) {
        var _this = _super.call(this) || this;
        _this.space = space;
        _this.build(min, max);
        return _this;
    }
    WormholeGeometry.prototype.build = function (min, max) {
        var xSegments = 80;
        var ySegments = 32;
        var xSegmentSize = (max - min) / xSegments;
        var ySegmentSize = Math.PI * 2 / ySegments;
        var uvs = [], normals = [];
        var arrayIndex = 0;
        for (var j = 0; j <= ySegments; j++) {
            for (var i = 0; i <= xSegments; i++) {
                var u = min + i * xSegmentSize;
                var v = max + j * ySegmentSize;
                uvs[arrayIndex] = new three_1.Vector2(u, v);
                normals[arrayIndex] = this.getNormal(u, v);
                this.vertices[arrayIndex] = this.getPoint(u, v);
                arrayIndex++;
            }
        }
        arrayIndex = 0;
        for (var j = 1; j <= ySegments; j++) {
            for (var i = 1; i <= xSegments; i++) {
                var a = (xSegments + 1) * j + i - 1;
                var b = (xSegments + 1) * (j - 1) + i - 1;
                var c = (xSegments + 1) * (j - 1) + i;
                var d = (xSegments + 1) * j + i;
                this.faces[arrayIndex] = new three_1.Face3(b, a, d, [
                    normals[b].clone(),
                    normals[a].clone(),
                    normals[d].clone()
                ]);
                this.faceVertexUvs[0][arrayIndex] = [
                    uvs[b].clone(),
                    uvs[a].clone(),
                    uvs[d].clone()
                ];
                arrayIndex++;
                this.faces[arrayIndex] = new three_1.Face3(b, d, c, [
                    normals[b].clone(),
                    normals[d].clone(),
                    normals[c].clone()
                ]);
                this.faceVertexUvs[0][arrayIndex] = [
                    uvs[b].clone(),
                    uvs[d].clone(),
                    uvs[c].clone()
                ];
                arrayIndex++;
            }
        }
        this.computeFaceNormals();
        this.verticesNeedUpdate = true;
        this.normalsNeedUpdate = true;
        this.uvsNeedUpdate = true;
    };
    WormholeGeometry.prototype.getPoint = function (x, y, target) {
        if (target === void 0) { target = new three_1.Vector3(); }
        var distanceToThroat = Math.abs(x) - this.space.throatLength;
        if (distanceToThroat < 0) {
            return target.set(this.space.radius * Math.cos(y), this.space.radius * Math.sin(y), x);
        }
        var distance = Math.sqrt(distanceToThroat * distanceToThroat + this.space.radiusSquared);
        var ratio = distance / this.space.radius;
        target.set(distance * Math.cos(y), distance * Math.sin(y), this.space.throatLength + this.space.radius * Math.log(ratio + Math.sqrt(ratio * ratio - 1)));
        if (x < 0) {
            target.z *= -1;
        }
        return target;
    };
    WormholeGeometry.prototype.getXTangent = function (x, y, target) {
        if (target === void 0) { target = new three_1.Vector3(); }
        var distanceToThroat = Math.max(Math.abs(x) - this.space.throatLength, 0);
        target.set(distanceToThroat * Math.cos(y) * (x < 0.0 ? -1.0 : 1.0), distanceToThroat * Math.sin(y) * (x < 0.0 ? -1.0 : 1.0), this.space.radius);
        return target.normalize();
    };
    WormholeGeometry.prototype.getNormal = function (x, y, target) {
        if (target === void 0) { target = new three_1.Vector3(); }
        var distanceToThroat = Math.abs(x) - this.space.throatLength;
        if (distanceToThroat < 0) {
            return target.set(Math.cos(y), Math.sin(y), 0.0);
        }
        var distance = Math.sqrt(distanceToThroat * distanceToThroat + this.space.radiusSquared);
        var derivX = new three_1.Vector3(distanceToThroat * Math.cos(y) * (x < 0.0 ? -1.0 : 1.0), distanceToThroat * Math.sin(y) * (x < 0.0 ? -1.0 : 1.0), this.space.radius);
        derivX.divideScalar(distance);
        var derivY = new three_1.Vector3(-distance * Math.sin(y), distance * Math.cos(y), 0.0);
        return target.crossVectors(derivY, derivX).normalize();
    };
    return WormholeGeometry;
}(three_1.Geometry));
exports.WormholeGeometry = WormholeGeometry;
