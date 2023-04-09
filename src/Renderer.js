"use strict";
exports.__esModule = true;
var three_1 = require("three");
var World_1 = require("./World");
var DiagramRenderer_1 = require("./renderer/DiagramRenderer");
var VRInstructions_1 = require("./VRInstructions");
var Renderer = /** @class */ (function () {
    function Renderer(webglRenderer, space, diagramMax, player) {
        var _this = this;
        this.webglRenderer = webglRenderer;
        this.space = space;
        this.diagramMax = diagramMax;
        this.player = player;
        this.showDiagram = true;
        this.scene = new three_1.Scene();
        this.light = new three_1.PointLight(0x554433, 1, 4);
        this.isXr = false;
        this.webglRenderer.autoClear = false;
        this.showDiagram = true;
        this.world = new World_1.World(space, player);
        this.diagramRenderer = new DiagramRenderer_1.DiagramRenderer(space, diagramMax);
        this.scene.add(this.world);
        this.scene.add(this.player);
        this.scene.add(new three_1.AmbientLight(0xffffff, 2));
        this.scene.add(this.light);
        this.vrInstructions = new VRInstructions_1.VRInstructions(this.player);
        this.vrInstructions.hide();
        var hideVrControls = function () { return _this.vrInstructions.hide(); };
        this.webglRenderer.xr.getController(0).addEventListener('selectstart', hideVrControls);
        this.webglRenderer.xr.getController(1).addEventListener('selectstart', hideVrControls);
        this.scene.add(this.vrInstructions);
        this.resize();
        window.addEventListener('resize', this.resize.bind(this), false);
    }
    Renderer.prototype.getWidth = function () {
        return this.webglRenderer.xr.isPresenting ? 1024 : window.innerWidth;
    };
    Renderer.prototype.getHeight = function () {
        return this.webglRenderer.xr.isPresenting ? 1024 : window.innerHeight;
    };
    Renderer.prototype.update = function (delta) {
        this.vrInstructions.update(delta);
    };
    Renderer.prototype.render = function () {
        if (this.webglRenderer.xr.isPresenting) {
            if (!this.isXr) {
                this.resize();
                this.vrInstructions.show();
                this.isXr = true;
            }
            this.renderVr();
        }
        else {
            if (this.isXr) {
                this.resize();
                this.vrInstructions.visible = false;
                this.isXr = false;
            }
            this.renderNormal();
        }
    };
    Renderer.prototype.renderNormal = function () {
        this.webglRenderer.clearColor();
        this.webglRenderer.setViewport(0, 0, this.getWidth(), this.getHeight());
        this.webglRenderer.render(this.scene, this.player.eyes);
        if (this.showDiagram) {
            this.webglRenderer.setViewport(0, 0, this.getWidth() / 3, this.getHeight() / 3);
            this.webglRenderer.clearDepth();
            this.diagramRenderer.render(this.webglRenderer, this.player);
        }
    };
    Renderer.prototype.renderVr = function () {
        this.webglRenderer.clearColor();
        this.webglRenderer.render(this.scene, this.player.eyes);
        this.player.eyes.getWorldPosition(this.light.position);
    };
    Renderer.prototype.resize = function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var pixelRatio = this.webglRenderer.getPixelRatio();
        var aspectRatio = width / height;
        this.webglRenderer.setSize(width, height);
        this.world.setSize(width * pixelRatio, height * pixelRatio);
        this.diagramRenderer.setRatio(aspectRatio);
        this.player.eyes.aspect = aspectRatio;
        // When the screen is vertical, the horizontal fov needs to be 60 degrees instead
        var minFov = 60;
        this.player.eyes.fov = this.player.eyes.aspect < 1
            ? 2 * three_1.MathUtils.RAD2DEG * Math.atan(Math.tan(minFov * 0.5 * three_1.MathUtils.DEG2RAD) / this.player.eyes.aspect)
            : minFov;
        this.player.eyes.updateProjectionMatrix();
    };
    return Renderer;
}());
exports.Renderer = Renderer;
