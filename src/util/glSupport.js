"use strict";
exports.__esModule = true;
var three_1 = require("three");
var canvas = document.createElement('canvas');
var gl = canvas.getContext('webgl');
var texture = gl.createTexture();
var framebuffer = gl.createFramebuffer();
var OES_texture_float = gl.getExtension('OES_texture_float');
var OES_texture_half_float = gl.getExtension('OES_texture_half_float');
/**
 * Returns whether rendering to floating point textures is supported.
 */
function getSupporedRenderTargetType() {
    var configs = [
        {
            extension: OES_texture_float,
            test: gl.FLOAT,
            type: three_1.FloatType
        },
        {
            extension: OES_texture_half_float,
            test: OES_texture_half_float === null || OES_texture_half_float === void 0 ? void 0 : OES_texture_half_float.HALF_FLOAT_OES,
            type: three_1.HalfFloatType
        }
    ];
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
        var config = configs_1[_i];
        if (!config.extension || !config.test) {
            continue;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, config.test, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
            return config.type;
        }
    }
    return three_1.UnsignedByteType;
}
/**
 * Returns whether rendering to textures with a side which is 1, 2, 4 or 8 pixels long is supported.
 */
function getSmallPOTRenderingSupported() {
    var texture = gl.createTexture();
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
        return false;
    }
    return true;
}
exports.glProfile = {
    renderTargetType: getSupporedRenderTargetType(),
    smallPotRendering: getSmallPOTRenderingSupported()
};
