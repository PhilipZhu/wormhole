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
var UiManager = /** @class */ (function () {
    function UiManager(main) {
        this.main = main;
        this.vrButton = document.querySelector('.start-vr');
        this.movementToggle = document.querySelector('[name=hide-ui]');
    }
    UiManager.prototype.showElement = function (el) {
        el.classList.remove('hidden');
    };
    UiManager.prototype.hideElement = function (el) {
        el.classList.add('hidden');
    };
    UiManager.prototype.toggleElement = function (el, force) {
        el.classList.toggle('hidden', force);
    };
    UiManager.prototype.startListening = function () {
        var _this = this;
        this.removeSplashScreen = this.removeSplashScreen.bind(this);
        this.updateFreeMovement = this.updateFreeMovement.bind(this);
        this.showVrButton = this.showVrButton.bind(this);
        this.hideVrButton = this.hideVrButton.bind(this);
        document.body.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                return;
            }
            _this.removeSplashScreen();
        }, false);
        this.movementToggle.checked = false;
        this.movementToggle.addEventListener('click', this.updateFreeMovement, false);
        this.startListeningForMobileControls();
        this.startListeningForDesktopControls();
        this.startListeningForVrControls();
        this.main.allControls.vr.disableAction.addListener(function () {
            _this.showVrButton();
        });
    };
    UiManager.prototype.startListeningForMobileControls = function () {
        var _this = this;
        document.addEventListener('touchstart', function (e) {
            if (e.target.tagName === 'A') {
                return;
            }
            _this.setControls('mobile');
        });
    };
    UiManager.prototype.startListeningForDesktopControls = function () {
        var _this = this;
        var canvas = this.main.canvas;
        canvas.addEventListener('click', function () {
            if (_this.main.currentControls !== _this.main.allControls.vr) {
                canvas.requestPointerLock();
            }
        }, false);
        document.addEventListener('pointerlockchange', function (e) {
            if (document.pointerLockElement === canvas) {
                _this.setControls('desktop');
            }
        }, false);
    };
    UiManager.prototype.startListeningForVrControls = function () {
        return __awaiter(this, void 0, void 0, function () {
            var WebXRPolyfill, xr, supported;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!navigator.xr) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('webxr-polyfill'); })];
                    case 1:
                        WebXRPolyfill = (_a.sent())["default"];
                        new WebXRPolyfill({ cardboard: false });
                        _a.label = 2;
                    case 2:
                        xr = navigator.xr;
                        if (!xr) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, xr.isSessionSupported('immersive-vr')];
                    case 3:
                        supported = _a.sent();
                        if (supported) {
                            this.showElement(this.vrButton);
                            this.vrButton.addEventListener('click', function () { return _this.setControls('vr'); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UiManager.prototype.setControls = function (controls) {
        this.main.setControls(controls);
        this.updateFreeMovement();
        switch (controls) {
            case 'mobile':
                this.showMobileControls();
                break;
            case 'vr':
                this.hideVrButton();
                break;
        }
    };
    UiManager.prototype.removeSplashScreen = function () {
        this.hideElement(document.querySelector('.splash'));
        document.body.removeEventListener('click', this.removeSplashScreen, false);
    };
    UiManager.prototype.showVrButton = function () {
        this.showElement(this.vrButton);
    };
    UiManager.prototype.hideVrButton = function () {
        this.hideElement(this.vrButton);
    };
    UiManager.prototype.showMobileControls = function () {
        var _this = this;
        this.removeSplashScreen();
        var element = document.querySelector('.mobile-instructions');
        this.showElement(element);
        var dismiss = function () {
            _this.hideElement(element);
            document.removeEventListener('touchstart', dismiss, false);
        };
        document.addEventListener('touchstart', dismiss, false);
    };
    UiManager.prototype.updateFreeMovement = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.movementToggle.checked) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.requestFreeMovement()];
                    case 2:
                        _a.sent();
                        this.main.renderer.showDiagram = false;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.movementToggle.checked = false;
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.main.renderer.showDiagram = true;
                        this.clearFreeMovement();
                        _a.label = 6;
                    case 6:
                        this.toggleElement(document.querySelector('.ui'), this.movementToggle.checked);
                        return [2 /*return*/];
                }
            });
        });
    };
    UiManager.prototype.requestFreeMovement = function () {
        var _a;
        return (_a = this.main.currentControls) === null || _a === void 0 ? void 0 : _a.requestFreeMovement();
    };
    UiManager.prototype.clearFreeMovement = function () {
        var _a;
        var player = this.main.player;
        player.position.y = Math.PI * 0.5;
        player.quaternion.x = 0;
        player.quaternion.z = 0;
        player.quaternion.normalize();
        player.eyes.quaternion.x = 0;
        player.eyes.quaternion.z = 0;
        player.eyes.quaternion.normalize();
        (_a = this.main.currentControls) === null || _a === void 0 ? void 0 : _a.stopFreeMovement();
    };
    return UiManager;
}());
exports.UiManager = UiManager;
