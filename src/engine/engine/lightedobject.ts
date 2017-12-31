import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import Shader from './shader';
import {mat, mat4} from '../matrix';
import {default as Engine} from './engine';
import Scene from './scene';
import Material from './material';

export default class LightedObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected indices: number[];
    protected material: Material;

    protected bufferCreated: boolean;

    protected vertexBuffer: WebGLBuffer;
    protected indexBuffer: WebGLBuffer;

    constructor(pos: Pos,
                vertices: number[],
                indices: number[],
                // colors: number[]
                material: Material) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.material = material;
        this.bufferCreated = false;
    }

    protected createBuffers(gl: WebGLRenderingContext) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        console.debug("creating geometry object:");
        console.debug(new Float32Array(this.vertices).length);
        console.debug(this.vertices.length);
        // console.debug(this.colors.length);
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
            modelMatrix = mat4.eyes();
        }

        const shader = engine.getCurrentShader();
        const uniformLocs = shader.getUniformLocations();
        const attribLocs = shader.getAttribLocations();

        const modelLoc = shader.getModelMatrixLocation();
        const modelMat = mat4.multiply(modelMatrix, mat4.eyes());
        gl.uniformMatrix4fv(modelLoc, false, new Float32Array(modelMat));

        gl.uniform3fv(uniformLocs["uMaterialAmbientColor"], this.material.ambientColor);
        gl.uniform3fv(uniformLocs["uMaterialDiffuseColor"], this.material.diffuseColor);
        gl.uniform3fv(uniformLocs["uMaterialSpecularColor"], this.material.specularColor);
        gl.uniform1f(uniformLocs["uMaterialShininess"], this.material.shininess);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexPos_model'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexPos_model']);

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

    let material = new Material(
        [0, 0, 0],
        [1.0, 0, 0],
        [0.085514, 0.355277, 0.074845],
        96.078431
    );

    return new LightedObject([0.0, 0.0, 0.0], positions, indices, material);
}