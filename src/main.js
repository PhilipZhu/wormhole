"use strict";
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
var WormholeSpace_1 = require("./WormholeSpace");
var Player_1 = require("./Player");
var Renderer_1 = require("./Renderer");
var PlayerControlsDesktop_1 = require("./PlayerControlsDesktop");
var PlayerControlsMobile_1 = require("./PlayerControlsMobile");
var PlayerControlsVr_1 = require("./PlayerControlsVr");
var three_1 = require("three");
var UiManager_1 = require("./UiManager");
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.wormholeSpace = new WormholeSpace_1.WormholeSpace(1.5, 5);
        this.prevTime = 0;
        var webglRenderer = new three_1.WebGLRenderer();
        this.canvas = webglRenderer.domElement;
        document.querySelector('#canvas-wrapper').appendChild(this.canvas);
        webglRenderer.setPixelRatio(window.devicePixelRatio);
        webglRenderer.xr.enabled = true;
        this.maxX = this.wormholeSpace.radius * 5.5 + this.wormholeSpace.throatLength;
        var playerX = this.wormholeSpace.radius * 2 + this.wormholeSpace.throatLength;
        this.player = new Player_1.Player(this.wormholeSpace);
        this.player.position.set(playerX, Math.PI * 0.5, 0);
        this.player.rotateY(Math.PI * 0.5);
        this.renderer = new Renderer_1.Renderer(webglRenderer, this.wormholeSpace, this.maxX, this.player);
        this.allControls = {
            desktop: new PlayerControlsDesktop_1.PlayerControlsKeyboard(this.player, this.canvas),
            mobile: new PlayerControlsMobile_1.PlayerControlsTouch(this.player, this.canvas),
            vr: new PlayerControlsVr_1.PlayerControlsVr(this.player, webglRenderer)
        };
        this.allControls.vr.disableAction.addListener(function () { return _this.clearControls(); });
        webglRenderer.setAnimationLoop(this.loop.bind(this));
        this.ui = new UiManager_1.UiManager(this);
        this.ui.startListening();
    }
    Main.prototype.setControls = function (scheme) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.currentControls === this.allControls[scheme]) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ((_a = this.currentControls) === null || _a === void 0 ? void 0 : _a.disable())];
                    case 1:
                        _b.sent();
                        this.currentControls = this.allControls[scheme];
                        return [4 /*yield*/, this.currentControls.enable()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.clearControls = function () {
        var _a;
        (_a = this.currentControls) === null || _a === void 0 ? void 0 : _a.disable();
        this.currentControls = undefined;
    };
    Main.prototype.loop = function (time) {
        var _a;
        var delta = (time - this.prevTime) / 1000;
        this.prevTime = time;
        // First frame the delta will be close to zero
        if (delta < 0.001)
            return;
        // If delta becomes too big we might get weird stuff happening
        if (delta > 0.1) {
            delta = 0.1;
        }
        (_a = this.currentControls) === null || _a === void 0 ? void 0 : _a.update(delta);
        this.player.updateMatrixWorld();
        if (this.player.position.x > this.maxX) {
            this.player.position.x = this.maxX;
        }
        else if (this.player.position.x < -this.maxX) {
            this.player.position.x = -this.maxX;
        }
        this.renderer.update(delta);
        this.renderer.render();
    };
    return Main;
}());
// WebXR only works in secure contexts
if (location.protocol === 'http:') {
    location.replace(location.href.replace('http:', 'https:'));
}
else {
    new Main();
}
