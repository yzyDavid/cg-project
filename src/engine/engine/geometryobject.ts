/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import Shader from './shader';
import {mat, mat4} from '../matrix';

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
