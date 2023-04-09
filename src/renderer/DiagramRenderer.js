"use strict";
exports.__esModule = true;
var WormholeGeometry_1 = require("./WormholeGeometry");
var three_1 = require("three");
var diagram_vs_glsl_1 = require("../shaders/diagram.vs.glsl");
var diagram_fs_glsl_1 = require("../shaders/diagram.fs.glsl");
var normal = new three_1.Vector3();
var tangent = new three_1.Vector3();
var bitangent = new three_1.Vector3();
var DiagramRenderer = /** @class */ (function () {
    function DiagramRenderer(space, limit) {
        this.space = space;
        this.limit = limit;
        this.scene = new three_1.Scene();
        this.camera = new three_1.PerspectiveCamera(60, 1, 1, 1000);
        this.playerMesh = new three_1.Object3D();
        this.camera.up.set(0, 0, 1);
        this.geometry = new WormholeGeometry_1.WormholeGeometry(space, -limit, limit);
        var playerMaterial = new three_1.MeshBasicMaterial();
        this.dotMesh = new three_1.Mesh(new three_1.SphereGeometry(0.1, 32, 32), playerMaterial);
        this.playerMesh.add(this.dotMesh);
        this.directionMesh = new three_1.Mesh(new three_1.BoxGeometry(0.1, 0.1, 0.4), playerMaterial);
        this.directionMesh.position.z = 0.2;
        this.playerMesh.add(this.directionMesh);
        this.scene.add(this.playerMesh);
        var loader = new three_1.TextureLoader();
        var gridTexture = loader.load('textures/grid.png');
        gridTexture.anisotropy = 4;
        gridTexture.wrapS = three_1.MirroredRepeatWrapping;
        gridTexture.wrapT = three_1.MirroredRepeatWrapping;
        var material = new three_1.ShaderMaterial({
            uniforms: {
                map: {
                    type: 't',
                    value: gridTexture
                }
            },
            vertexShader: diagram_vs_glsl_1["default"],
            fragmentShader: diagram_fs_glsl_1["default"],
            side: three_1.DoubleSide,
            blending: three_1.AdditiveBlending,
            transparent: true,
            depthTest: false
        });
        this.scene.add(new three_1.Mesh(this.geometry, material));
    }
    DiagramRenderer.prototype.setRatio = function (ratio) {
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
    };
    DiagramRenderer.prototype.render = function (renderer, player) {
        var position = player.position;
        var rotation = new three_1.Euler().setFromQuaternion(player.eyes.getWorldQuaternion(new three_1.Quaternion()));
        var point = this.geometry.getPoint(position.x, position.z);
        var radius = Math.sqrt(point.x * point.x + point.y * point.y);
        var scale = this.limit + 1;
        this.camera.position.set(point.x / radius * scale, point.y / radius * scale, 0);
        this.camera.lookAt(point);
        this.playerMesh.position.copy(point);
        // Create and set a base rotation matrix
        this.geometry.getNormal(position.x, position.z, normal);
        this.geometry.getXTangent(position.x, position.z, tangent);
        bitangent.crossVectors(normal, tangent);
        var rotationMatrix = new three_1.Matrix4();
        rotationMatrix.elements[0] = normal.x;
        rotationMatrix.elements[1] = normal.y;
        rotationMatrix.elements[2] = normal.z;
        rotationMatrix.elements[4] = tangent.x;
        rotationMatrix.elements[5] = tangent.y;
        rotationMatrix.elements[6] = tangent.z;
        rotationMatrix.elements[8] = bitangent.x;
        rotationMatrix.elements[9] = bitangent.y;
        rotationMatrix.elements[10] = bitangent.z;
        this.playerMesh.quaternion.setFromRotationMatrix(rotationMatrix);
        // Rotate player visualization accordingly
        this.playerMesh.rotateY(rotation.x);
        this.playerMesh.rotateX(rotation.y);
        renderer.render(this.scene, this.camera);
    };
    return DiagramRenderer;
}());
exports.DiagramRenderer = DiagramRenderer;
