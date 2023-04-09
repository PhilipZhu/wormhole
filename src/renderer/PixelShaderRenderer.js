"use strict";
exports.__esModule = true;
var three_1 = require("three");
var FullScreenMesh_1 = require("./FullScreenMesh");
var PixelShaderRenderer = /** @class */ (function () {
    function PixelShaderRenderer(shaderMaterial, renderTarget) {
        this.renderTarget = renderTarget;
        this.camera = new three_1.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new three_1.Scene();
        this.scene.add(new FullScreenMesh_1.FullScreenMesh(shaderMaterial));
    }
    PixelShaderRenderer.prototype.render = function (renderer) {
        var previousRenderTarget = renderer.getRenderTarget();
        var previousXrEnabled = renderer.xr.enabled;
        renderer.setRenderTarget(this.renderTarget);
        renderer.xr.enabled = false;
        renderer.shadowMap.autoUpdate = false;
        renderer.state.buffers.depth.setMask(true);
        if (renderer.autoClear === false) {
            renderer.clear();
        }
        renderer.render(this.scene, this.camera);
        renderer.xr.enabled = previousXrEnabled;
        renderer.setRenderTarget(previousRenderTarget);
    };
    return PixelShaderRenderer;
}());
exports.PixelShaderRenderer = PixelShaderRenderer;
