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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var PixelShaderRenderer_1 = require("./renderer/PixelShaderRenderer");
var glSupport_1 = require("./util/glSupport");
var three_1 = require("three");
var integration_vs_glsl_1 = require("./shaders/integration.vs.glsl");
var integration_fs_glsl_1 = require("./shaders/integration.fs.glsl");
var render_vs_glsl_1 = require("./shaders/render.vs.glsl");
var render_fs_glsl_1 = require("./shaders/render.fs.glsl");
var mipmaps_1 = require("./util/mipmaps");
var MathUtils_1 = require("./MathUtils");
function loadSkybox(path, ext) {
    var _this = this;
    if (ext === void 0) { ext = 'jpg'; }
    var files = [
        'sky_pos_x', 'sky_neg_x',
        'sky_pos_y', 'sky_neg_y',
        'sky_pos_z', 'sky_neg_z'
    ].map(function (file) { return file + '.' + ext; });
    var cubeTexture = new three_1.CubeTextureLoader()
        .setPath(path)
        .load(files, function () { return __awaiter(_this, void 0, void 0, function () {
        var images, mipmapImageData, mipmapCount, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    images = cubeTexture.images;
                    return [4 /*yield*/, Promise.all(images.map(mipmaps_1.generateMipmaps))];
                case 1:
                    mipmapImageData = _a.sent();
                    mipmapCount = mipmapImageData[0].length;
                    cubeTexture.mipmaps = [];
                    for (i = 0; i < mipmapCount; i++) {
                        cubeTexture.mipmaps.push(new three_1.CubeTexture([
                            mipmapImageData[0][i],
                            mipmapImageData[1][i],
                            mipmapImageData[2][i],
                            mipmapImageData[3][i],
                            mipmapImageData[4][i],
                            mipmapImageData[5][i]
                        ]));
                    }
                    cubeTexture.generateMipmaps = false;
                    cubeTexture.needsUpdate = true;
                    return [2 /*return*/];
            }
        });
    }); });
    return cubeTexture;
}
var tempTranslation = new three_1.Vector3();
var tempQuaternion = new three_1.Quaternion();
var tempScale = new three_1.Vector3();
var inverseMatrix = new three_1.Matrix4();
var orientationMatrix = new three_1.Matrix4();
var aspectFixMatrix = new three_1.Matrix4();
var World = /** @class */ (function (_super) {
    __extends(World, _super);
    function World(space, player) {
        var _this = _super.call(this) || this;
        _this.space = space;
        _this.player = player;
        _this.frustumCulled = false;
        // Init skybox textures
        var skybox1 = loadSkybox('textures/skybox1/');
        var skybox2 = loadSkybox('textures/skybox2/');
        // Init uniforms
        _this.commonUniforms = {
            uRadiusSquared: { type: 'f', value: space.radiusSquared },
            uThroatLength: { type: 'f', value: space.throatLength },
            uCameraPosition: { type: 'v3', value: new three_1.Vector3() },
            uCameraOrientation: { type: 'm4', value: new three_1.Matrix4() },
            uAngleRange: { type: 'v2', value: new three_1.Vector2() }
        };
        // Init defines
        var commonDefines = {
            RENDER_TO_FLOAT_TEXTURE: ~~(glSupport_1.glProfile.renderTargetType === three_1.FloatType || glSupport_1.glProfile.renderTargetType === three_1.HalfFloatType)
        };
        // Init integration stuff
        // Quirk: some older GPUs do not support rendering to textures with a side of 1, 2, 4 or 8 pixels long.
        // To keep the performance high, we lower the resolution for those GPUs as well
        var width = glSupport_1.glProfile.smallPotRendering ? 2048 : 1024;
        var height = glSupport_1.glProfile.smallPotRendering ? 1 : 3;
        _this.integrationBuffer = new three_1.WebGLRenderTarget(width, height, {
            wrapS: three_1.ClampToEdgeWrapping,
            wrapT: three_1.ClampToEdgeWrapping,
            format: three_1.RGBAFormat,
            type: glSupport_1.glProfile.renderTargetType,
            depthBuffer: false,
            stencilBuffer: false,
            generateMipmaps: false
        });
        var integrationShader = new three_1.RawShaderMaterial({
            uniforms: __assign({}, _this.commonUniforms),
            defines: commonDefines,
            vertexShader: integration_vs_glsl_1["default"],
            fragmentShader: integration_fs_glsl_1["default"]
        });
        _this.integrationStep = new PixelShaderRenderer_1.PixelShaderRenderer(integrationShader, _this.integrationBuffer);
        // Init render stuff
        var renderShader = new three_1.RawShaderMaterial({
            uniforms: __assign({ uIntegrationBuffer: { type: 't', value: _this.integrationBuffer.texture }, uSkybox1: { type: 't', value: skybox1 }, uSkybox2: { type: 't', value: skybox2 } }, _this.commonUniforms),
            defines: commonDefines,
            vertexShader: render_vs_glsl_1["default"],
            fragmentShader: render_fs_glsl_1["default"]
        });
        _this.renderResultBuffer = new three_1.WebGLRenderTarget(1024, 1024, {
            depthBuffer: false,
            stencilBuffer: false,
            generateMipmaps: false
        });
        _this.renderStep = new PixelShaderRenderer_1.PixelShaderRenderer(renderShader, _this.renderResultBuffer);
        _this.onBeforeRender = _this.beforeRender.bind(_this);
        _this.geometry = new three_1.PlaneBufferGeometry(2, 2, 32, 32);
        _this.material = new three_1.MeshBasicMaterial({
            map: _this.renderResultBuffer.texture,
            depthWrite: false
        });
        _this.renderOrder = -1;
        return _this;
    }
    World.prototype.beforeRender = function (renderer, scene, currentCamera) {
        var camera = currentCamera;
        // Gotta decompose, get the inverse and aspect manually because the matrices of "XR cameras" are changed
        // directly, without updating all these things
        camera.matrixWorld.decompose(tempTranslation, tempQuaternion, tempScale);
        inverseMatrix.getInverse(camera.projectionMatrix);
        var e0 = inverseMatrix.elements[0];
        var e5 = inverseMatrix.elements[5];
        var aspect = e0 / e5;
        aspectFixMatrix.elements[0] = e0;
        aspectFixMatrix.elements[5] = e5;
        this.position.copy(tempTranslation);
        this.quaternion.copy(tempQuaternion);
        this.scale.set(e0, e5, 1);
        this.translateZ(-1);
        this.updateMatrixWorld();
        // Only compute for the left eye and reuse for the right eye
        if (camera.layers.mask & 4) {
            return;
        }
        // Update the angle range
        orientationMatrix.makeRotationFromQuaternion(tempQuaternion);
        var zAxis = new three_1.Vector3();
        zAxis.setFromMatrixColumn(orientationMatrix, 2);
        var angleFromZ = zAxis.angleTo(MathUtils_1.UnitXNeg);
        var halfDiagFov = Math.atan(e5 * Math.sqrt(aspect * aspect + 1));
        this.commonUniforms.uAngleRange.value.set(Math.max(0, angleFromZ - halfDiagFov), Math.min(Math.PI, angleFromZ + halfDiagFov));
        // Update the camera-related uniforms
        this.commonUniforms.uCameraPosition.value.copy(this.player.position);
        this.commonUniforms.uCameraOrientation.value.copy(orientationMatrix);
        this.commonUniforms.uCameraOrientation.value.multiply(aspectFixMatrix);
        this.integrationStep.render(renderer);
        this.renderStep.render(renderer);
        // WebXR cameras have viewports which need to be restored
        var viewport = currentCamera.viewport;
        if (viewport) {
            renderer.state.viewport(viewport);
        }
    };
    World.prototype.setSize = function (width, height) {
        this.renderResultBuffer.setSize(width, height);
    };
    return World;
}(three_1.Mesh));
exports.World = World;
