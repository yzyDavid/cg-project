import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import {mat, mat4} from '../matrix';
import {default as Engine} from './engine';
import Material from './material';
import LightingShader from "./lightingshader";

export default class UnniversalObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected normals: number[];
    protected indices: number[];
    protected vt: number[];
    protected material: Material;

    protected bufferCreated: boolean;
    protected normalBuffer: WebGLBuffer;
    protected vertexBuffer: WebGLBuffer;
    protected indexBuffer: WebGLBuffer;

    protected textBuffer: WebGLBuffer;
    protected texture: WebGLTexture;
    protected texturefile: string;

    constructor(pos: Pos,
                vertices: number[],
                normals: number[],
                indices: number[],
                material: Material,
                vt: number[],
                texturefile: string) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;
        this.material = material;
        this.bufferCreated = false;
        this.texturefile = texturefile;
        this.vt = vt;
    }

    saveObj = function () {
        let output: string = "";
        let n = this.vertices.length;
        for (let i = 0; i < n; i = i + 3) {
            output = output + "v " + this.vertices[i] + " " + this.vertices[i + 1] + " " + this.vertices[i + 2] + "\n";
        }
        n = this.vt.length;
        for (let i = 0; i < n; i = i + 2) {
            output = output + "vt " + this.vt[i] + " " + this.vt[i + 1] + "\n";
        }
        n = this.indices.length;
        for (let i = 0; i < n; i = i + 3) {
            output = output + "f " + this.indices[i] + "/" + this.indices[i] + " " + this.indices[i + 1] + "/" + this.indices[i + 1] + " " + this.indices[i + 2] + "/" + this.indices[i + 2] + " " + "\n";
        }
        return output;
    }

    create_texture = function (gl: WebGLRenderingContext, source: string, texture: WebGLTexture, u_Sampler: WebGLUniformLocation) {
        var img = new Image();
        img.onload = function () {
            texture = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            gl.uniform1i(u_Sampler, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        img.src = source;
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

        this.textBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vt), gl.STATIC_DRAW);

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
        const lightingShader = <LightingShader>(engine.getCurrentShader());

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

        //has material or texture infos?
        if (this.material.getAmbientColor().indexOf(0)==-1) gl.uniform1f(uniformLocs["hasAmbientColor"], -1); else gl.uniform1f(uniformLocs["hasAmbientColor"], 1);
        if (this.material.getDiffuseColor().indexOf(0)==-1) gl.uniform1f(uniformLocs["hasDiffuseColor"], -1); else gl.uniform1f(uniformLocs["hasDiffuseColor"], 1);
        if (this.material.getSpecularColor().indexOf(0)==-1) gl.uniform1f(uniformLocs["hasSpecularColor"], -1);else gl.uniform1f(uniformLocs["hasSpecularColor"], 1);

        // Vertex positions in MCS.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexPos_model'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexPos_model']);

        // Vertex normals in MCS.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexNormal_model'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexNormal_model']);

        if (this.texturefile=="none")
        {
            gl.uniform1f(uniformLocs["hasText"], -1);
        }
        else {
            //texture
            gl.uniform1f(uniformLocs["hasText"], 1);
            const a_TexCoord = attribLocs['a_TextCoord'];
            const u_Sampler = attribLocs['u_Sampler'];
            this.create_texture(gl, this.texturefile, this.texture, u_Sampler);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textBuffer);
            gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_TexCoord);
        }

        // Indices.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const vertexCount = this.indices.length;
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
}

// export function makeDemoLightedCube() {
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
//     const indices = [
//         0, 1, 2, 0, 2, 3,    // front
//         4, 5, 6, 4, 6, 7,    // back
//         8, 9, 10, 8, 10, 11,   // top
//         12, 13, 14, 12, 14, 15,   // bottom
//         16, 17, 18, 16, 18, 19,   // right
//         20, 21, 22, 20, 22, 23,   // left
//     ];
//
//     const material = new Material(
//         [1, 0, 0],
//         [1, 0, 0],
//         [1, 1, 1],
//         30
//     );
//
//     return new LightedObject([0.0, 0.0, 0.0], positions, positions, indices, material);
// }