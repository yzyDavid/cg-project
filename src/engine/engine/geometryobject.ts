/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import Shader from './shader';
import {mat, mat4} from '../matrix';
import {default as Engine} from './engine';
import Scene from './scene';


// a demo object.
export default class GeometryObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected indices: number[];
    protected colors: number[];
    protected vt:number[];

    protected bufferCreated: boolean;

    protected vertexBuffer: WebGLBuffer;
    protected colorBuffer: WebGLBuffer;
    protected indexBuffer: WebGLBuffer;
    protected textBuffer:WebGLBuffer;

    protected texture:WebGLTexture;
    protected  texturefile:string;
    protected hasTexture:boolean;

    constructor(pos: Pos,
                vertices: number[],
                indices: number[],
                colors: number[],
                vt:number[],
                texturefile:string,
                hasText:boolean) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
        this.bufferCreated = false;
        this.texturefile=texturefile;
        this.vt=vt;
        this.hasTexture=hasText;
    }

    saveObj=function(){
        var output:string="";
        var n=this.vertices.length;
        for (var i=0;i<n;i=i+3){
            output=output+"v "+this.vertices[i]+" "+this.vertices[i+1]+" "+this.vertices[i+2]+"\n";
        }
        n=this.vt.length;
        for (var i=0;i<n;i=i+2){
            output=output+"vt "+this.vt[i]+" "+this.vt[i+1]+"\n";
        }
        n=this.indices.length;
        for (var i=0;i<n;i=i+3){
            output=output+"f "+this.indices[i]+"/"+this.indices[i]+" "+this.indices[i+1]+"/"+this.indices[i+1]+" "+this.indices[i+2]+"/"+this.indices[i+2]+" "+"\n";
        }
        return output;
    }

    create_texture=function(gl:WebGLRenderingContext,source:string,texture:WebGLTexture,u_Sampler:WebGLUniformLocation){
        var img = new Image();
        img.onload = function(){
            texture = gl.createTexture();//创建纹理图像缓冲区
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //纹理图片上下反转
            gl.activeTexture(gl.TEXTURE0);//激活0号纹理单元TEXTURE0
            gl.bindTexture(gl.TEXTURE_2D, texture);//绑定纹理缓冲区
            //设置纹理贴图填充方式(纹理贴图像素尺寸大于顶点绘制区域像素尺寸)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //设置纹素格式，jpg格式对应gl.RGB
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            gl.uniform1i(u_Sampler, 0);//纹理缓冲区单元TEXTURE0中的颜色数据传入片元着色器
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        img.src = source;
    }

    protected createBuffers(gl: WebGLRenderingContext) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        if (!this.hasTexture) {
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        }
        else {
            this.textBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vt), gl.STATIC_DRAW);
        }

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        console.debug("creating geometry object:");
        console.debug(new Float32Array(this.vertices).length);
        console.debug(this.vertices.length);
        console.debug(this.vt.length);
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

        const shader = engine.getCurrentShader();

        const attribLocs = shader.getAttribLocations();
        const loc = attribLocs['aVertexPosition'];

        const vertexCount = this.indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        if (!this.hasTexture) {
            const clr = attribLocs['aVertexColor'];
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(clr, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(clr);
        }
        else {
            const a_TexCoord = attribLocs['a_TextCoord'];
            const u_Sampler = attribLocs['u_Sampler'];
            this.create_texture(gl, this.texturefile, this.texture, u_Sampler);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textBuffer);
            gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_TexCoord);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const modelLoc = shader.getModelMatrixLocation();
        const modelMat = mat4.multiply(modelMatrix, mat4.identity());
        gl.uniformMatrix4fv(modelLoc, false, new Float32Array(modelMat));

        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
}

// export function makeDemoCube() {
//     const positions = [
//         // Front face
//         -1.0, -1.0, 1.0,
//         1.0, -1.0, 1.0,
//         1.0, 1.0, 1.0,
//         -1.0, 1.0, 1.0,
//
//         // Back face
//         -1.0, -1.0, -1.0,
//         -1.0, 1.0, -1.0,
//         1.0, 1.0, -1.0,
//         1.0, -1.0, -1.0,
//
//         // Top face
//         -1.0, 1.0, -1.0,
//         -1.0, 1.0, 1.0,
//         1.0, 1.0, 1.0,
//         1.0, 1.0, -1.0,
//
//         // Bottom face
//         -1.0, -1.0, -1.0,
//         1.0, -1.0, -1.0,
//         1.0, -1.0, 1.0,
//         -1.0, -1.0, 1.0,
//
//         // Right face
//         1.0, -1.0, -1.0,
//         1.0, 1.0, -1.0,
//         1.0, 1.0, 1.0,
//         1.0, -1.0, 1.0,
//
//         // Left face
//         -1.0, -1.0, -1.0,
//         -1.0, -1.0, 1.0,
//         -1.0, 1.0, 1.0,
//         -1.0, 1.0, -1.0,
//     ];
//
//     const faceColors = [
//         [0.7, 0.7, 0.3, 1.0],    // Front face: white - modified
//         [1.0, 0.0, 0.0, 1.0],    // Back face: red
//         [0.0, 1.0, 0.0, 1.0],    // Top face: green
//         [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
//         [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
//         [1.0, 0.0, 1.0, 1.0],    // Left face: purple
//     ];
//
//     const indices = [
//         0, 1, 2, 0, 2, 3,    // front
//         4, 5, 6, 4, 6, 7,    // back
//         8, 9, 10, 8, 10, 11,   // top
//         12, 13, 14, 12, 14, 15,   // bottom
//         16, 17, 18, 16, 18, 19,   // right
//         20, 21, 22, 20, 22, 23,   // left
//     ];
//
//     let colors: number[] = [];
//     faceColors.forEach(v => {
//         colors = colors.concat(v, v, v, v);
//     });
//
//     return new GeometryObject([0.0, 0.0, 0.0], positions, indices, colors);
// }