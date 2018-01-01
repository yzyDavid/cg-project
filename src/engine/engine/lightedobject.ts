import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import Shader from './shader';
import {mat, mat4} from '../matrix';
import {default as Engine} from './engine';
import Scene from './scene';
import Material from './material';
import LightingShader from "./lightingshader";

export default class LightedObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected normals: number[];
    protected indices: number[];
    protected material: Material;

    protected bufferCreated: boolean;
    protected normalBuffer: WebGLBuffer;
    protected vertexBuffer: WebGLBuffer;

    protected indexBuffer: WebGLBuffer;

    constructor(pos: Pos,
                vertices: number[],
                normals: number[],
                indices: number[],
                material: Material) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;
        this.material = material;
        this.bufferCreated = false;
    }

    protected createBuffers(gl: WebGLRenderingContext) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        console.debug("creating lighted geometry object:");
        console.debug(new Float32Array(this.vertices).length);
        console.debug(this.vertices.length);
        console.debug(this.normals.length);
        console.debug(this.indices.length);
    }

    protected deleteBuffers() {
    }

    draw(gl: WebGLRenderingContext, engine: Engine, modelMatrix?: mat): void {
        if (!this.bufferCreated) {
            this.createBuffers(gl);
            this.bufferCreated = true;
        }

        if (!modelMatrix) {
            modelMatrix = mat4.identity();
        }

        // Use lighting shader.
        const shaderManager = engine.getShaderManager();
        if (!(shaderManager.useShader('lighting'))) {
            shaderManager.addShader(new LightingShader(gl));
            shaderManager.useShader('lighting');
        }
        const lightingShader =  <LightingShader>(engine.getCurrentShader());

        const uniformLocs = lightingShader.getUniformLocations();
        const attribLocs = lightingShader.getAttribLocations();

        // Set lights and camera.
        lightingShader.setLights(engine.getScene().getLights());
        lightingShader.setCamera(engine.getScene().getCamera());

        // Model matrix.
        const modelLoc = lightingShader.getModelMatrixLocation();
        const modelMat = mat4.multiply(modelMatrix, mat4.identity());
        gl.uniformMatrix4fv(modelLoc, false, new Float32Array(modelMat));

        // Model normal matrix.
        const modelNormalMat = modelMat;
        mat4.invert(modelNormalMat, modelNormalMat);
        mat4.transpose(modelNormalMat, modelNormalMat);
        gl.uniformMatrix4fv(uniformLocs['uModelNormalMatrix'], false, new Float32Array(modelNormalMat));

        // Material.
        gl.uniform3fv(uniformLocs["uMaterialAmbientColor"], this.material.getAmbientColor());
        gl.uniform3fv(uniformLocs["uMaterialDiffuseColor"], this.material.getDiffuseColor());
        gl.uniform3fv(uniformLocs["uMaterialSpecularColor"], this.material.getSpecularColor());
        gl.uniform1f(uniformLocs["uMaterialShininess"], this.material.getShininess());

        // Vertex positions in MCS.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexPos_model'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexPos_model']);

        // Vertex normals in MCS.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexNormal_model'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexNormal_model']);

        // Indices.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const vertexCount = this.indices.length;
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
}

export function makeDemoLightedCube() {
    const positions = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];

    const indices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ];

    const material = new Material(
        [1, 0, 0],
        [1.0, 0, 0],
        [1, 1, 1],
        50
    );

    return new LightedObject([0.0, 0.0, 0.0], positions, positions, indices, material);
}