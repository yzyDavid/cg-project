/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import Shader from './shader';
import {mat, mat4} from '../matrix';
import {log} from './engine';

// a demo object.
export default class GeometryObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected indices: number[];
    protected colors: number[];

    constructor(pos: Pos,
                vertices: number[],
                indices: number[],
                colors: number[]) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
    }

    draw(gl: WebGLRenderingContext, shader: Shader, modelMatrix: mat) {
        const mvLoc = shader.getModelViewMatrixLocation();
        const mvMat = mat4.eyes();
        gl.uniformMatrix4fv(mvLoc, false, new Float32Array(mvMat));

        const attribLocs = shader.getAttribLocations();
        const loc = attribLocs['aVertexLocation'];
        const clr = attribLocs['aVertexColor'];
        const vertexCount = this.indices.length;

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(clr, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(clr);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
}

export function makeDemoCube() {
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

    const faceColors = [
        [1.0, 1.0, 1.0, 1.0],    // Front face: white
        [1.0, 0.0, 0.0, 1.0],    // Back face: red
        [0.0, 1.0, 0.0, 1.0],    // Top face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // Left face: purple
    ];

    const indices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ];

    const colors: number[] = [];
    faceColors.forEach(v => colors.push(v[0], v[1], v[2], v[3]));

    return new GeometryObject([0.0, 0.0, 0.0], positions, indices, colors);
}