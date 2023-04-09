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
var geometry = new three_1.PlaneBufferGeometry(2, 2);
geometry.deleteAttribute('normal');
var FullScreenMesh = /** @class */ (function (_super) {
    __extends(FullScreenMesh, _super);
    function FullScreenMesh(material) {
        var _this = _super.call(this, geometry, material) || this;
        _this.frustumCulled = false;
        return _this;
    }
    return FullScreenMesh;
}(three_1.Mesh));
exports.FullScreenMesh = FullScreenMesh;
