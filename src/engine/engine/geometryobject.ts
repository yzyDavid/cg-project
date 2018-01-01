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

    protected bufferCreated: boolean;

    protected vertexBuffer: WebGLBuffer;
    protected colorBuffer: WebGLBuffer;
    protected indexBuffer: WebGLBuffer;

    protected texture:WebGLTexture;
    protected  texturefile:string;

    constructor(pos: Pos,
                vertices: number[],
                indices: number[],
                colors: number[],
                texturefile:string) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
        this.bufferCreated = false;
        this.texturefile=texturefile;
    }

    create_texture=function(gl:WebGLRenderingContext,source:string,texture:WebGLTexture){
        // イメージオブジェクトの生成
        var img = new Image();

        // データのオンロードをトリガーにする
        img.onload = function(){
            // テクスチャオブジェクトの生成
            var tex = gl.createTexture();

            // テクスチャをバインドする
            gl.bindTexture(gl.TEXTURE_2D, tex);

            // テクスチャへイメージを適用
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            // ミップマップを生成
            gl.generateMipmap(gl.TEXTURE_2D);

            // テクスチャのバインドを無効化
            gl.bindTexture(gl.TEXTURE_2D, null);

            // 生成したテクスチャをグローバル変数に代入
            texture = tex;
        };

        // イメージオブジェクトのソースを指定
        img.src = source;
    }

    // initTextures=function(gl: WebGLRenderingContext,Url:string,texture:WebGLTexture) {
    //     console.log(gl,"image to onload ..",gl);
    //     texture = gl.createTexture();   // Create a texture object
    //     if (!texture) {
    //         console.log('Failed to create the texture object');
    //         return false;
    //     }
    //     var image = new Image();  // Create the image object
    //     if (!image) {
    //         console.log('Failed to create the image object');
    //         return false;
    //     }
    //     // Register the event handler to be called on loading an image
    //     image.onload = function(){
    //         //mtlOK++;
    //         console.log("image onload");
    //         var loadTexture=function(gl: WebGLRenderingContext, n:number, texture:WebGLTexture, image:HTMLImageElement) {
    //             var TextureList = [gl.TEXTURE0,gl.TEXTURE1,gl.TEXTURE2,gl.TEXTURE3,gl.TEXTURE4,gl.TEXTURE5,gl.TEXTURE6,gl.TEXTURE7];
    //
    //             gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    //             // Enable texture unit0
    //             gl.activeTexture(TextureList[n]);
    //             // Bind the texture object to the target
    //             gl.bindTexture(gl.TEXTURE_2D, texture);
    //
    //             // Set the texture parameters
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //             // Set the texture image
    //             gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //
    //             //loadTextures.unload-=1;
    //             // Set the texture unit 0 to the sampler
    //             // gl.uniform1i(u_Sampler, n);
    //         }
    //         loadTexture(gl, 0, texture, image);
    //     };
    //     // Tell the browser to load an image
    //     image.src = Url;
    //     return true;
    // }



    protected createBuffers(gl: WebGLRenderingContext) {
        this.create_texture(gl,this.texturefile,this.texture);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        console.debug("creating geometry object:");
        console.debug(new Float32Array(this.vertices).length);
        console.debug(this.vertices.length);
        console.debug(this.colors.length);
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
        const clr = attribLocs['aVertexColor'];
        const vertexCount = this.indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(clr, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(clr);

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