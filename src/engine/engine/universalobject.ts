import IncolliableObject from './incolliableobject';
import {Drawable} from './component';
import {Pos} from './public';
import {mat, mat4} from '../matrix';
import {default as Engine} from './engine';
import Material from './material';
import LightingShader from "./lightingshader";

export default class UniversalObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected normals: number[];
    protected indices: number[];
    protected textureCoords: number[];  // Vertex texture coordinates.
    protected material: Material;

    protected inited: boolean;
    protected normalBuffer: WebGLBuffer;
    protected vertexBuffer: WebGLBuffer;
    protected indexBuffer: WebGLBuffer;
    protected texCoordBuffer: WebGLBuffer;

    protected texture: WebGLTexture;
    protected textureImage: HTMLImageElement;

    constructor(pos: Pos,
                vertices: number[],
                normals: number[],
                indices: number[],
                material: Material,
                vt: number[],
                texture?: HTMLImageElement) {
        super(pos, undefined);
        this.vertices = vertices;
        this.normals = normals;
        this.indices = indices;
        this.material = material;
        this.textureCoords = vt;
        this.textureImage = texture;
        this.inited = false;

        console.debug("create a new universal object successfully:");
        console.debug(this.textureCoords);
    }

    saveObj(name: String) {
        let output: string = "o " + name + "\n";
        let n = this.vertices.length;
        for (let i = 0; i < n; i = i + 3) {
            output = output + "v " + this.vertices[i] + " " + this.vertices[i + 1] + " " + this.vertices[i + 2] + "\n";
        }
        n = this.textureCoords.length;
        for (let i = 0; i < n; i = i + 2) {
            output = output + "vt " + this.textureCoords[i] + " " + this.textureCoords[i + 1] + "\n";
        }
        n = this.indices.length;
        output = output + "usemtl " + name + ".mtl\n";
        for (let i = 0; i < n; i = i + 3) {
            output = output + "f " + this.indices[i] + "/" + this.indices[i] + " " + this.indices[i + 1] + "/" + this.indices[i + 1] + " " + this.indices[i + 2] + "/" + this.indices[i + 2] + " " + "\n";
        }
        return output;
    }

    saveMtl(name: String) {
        let output: string = "newmtl " + name + "\n";
        if (this.material.getAmbientColor().indexOf(0) == -1)
            output = output + "Ka " + this.material.getAmbientColor()[0] + " " + this.material.getAmbientColor()[1] + " " + this.material.getAmbientColor()[2] + "\n";
        if (this.material.getDiffuseColor().indexOf(0) == -1)
            output = output + "Kd " + this.material.getDiffuseColor()[0] + " " + this.material.getDiffuseColor()[1] + " " + this.material.getDiffuseColor()[2] + "\n";
        if (this.material.getSpecularColor().indexOf(0) == -1)
            output = output + "Ka " + this.material.getSpecularColor()[0] + " " + this.material.getSpecularColor()[1] + " " + this.material.getSpecularColor()[2] + "\n";
        if (this.textureImage) output = output + this.textureImage.src;
        return output;
    }

    protected initDraw(gl: WebGLRenderingContext) {
        if (this.textureImage) {
            this.texture = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.textureImage);
            gl.bindTexture(gl.TEXTURE_2D, null);  // Unbind.
        }

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        console.debug("creating lighted geometry object:");
        console.debug(new Float32Array(this.vertices).length);
        console.debug(this.vertices.length);
        console.debug(this.normals.length);
        console.debug(this.textureCoords.length);
        console.debug(this.indices.length);
    }

    protected deleteBuffers() {
    }

    draw(gl: WebGLRenderingContext, engine: Engine, modelMatrix?: mat): void {
        // Init
        if (!this.inited) {
            this.initDraw(gl);
            this.inited = true;
        }

        if (!modelMatrix) {
            modelMatrix = this.modelMatrix;
        } else modelMatrix = mat4.multiply(this.modelMatrix, modelMatrix);

        // Switch to lighting shader.
        const shaderManager = engine.getShaderManager();
        if (!(shaderManager.useShader('lighting'))) {
            shaderManager.addShader(new LightingShader(gl));
            shaderManager.useShader('lighting');
        }
        const lightingShader = <LightingShader>(engine.getCurrentShader());

        // Get attribute and uniform locations.
        const uniformLocs = lightingShader.getUniformLocations();
        const attribLocs = lightingShader.getAttribLocations();

        // Lights.
        lightingShader.setLights(engine.getScene().getLights());

        // Camera.
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
        gl.uniform3fv(uniformLocs["uMaterial.ambient"], this.material.getAmbientColor());
        gl.uniform3fv(uniformLocs["uMaterial.diffuse"], this.material.getDiffuseColor());
        gl.uniform3fv(uniformLocs["uMaterial.specular"], this.material.getSpecularColor());
        gl.uniform1f(uniformLocs["uMaterial.shininess"], this.material.getShininess());

        // Texture and texture coordinates.
        if (this.textureImage) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(uniformLocs['uMaterial.diffuseMap'], 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.vertexAttribPointer(attribLocs['aTexCoord'], 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(attribLocs['aTexCoord']);

            gl.uniform1f(uniformLocs['uMaterial.useDiffuseMap'], 1.0);
        } else {
            gl.uniform1f(uniformLocs['uMaterial.useDiffuseMap'], 0.0);
        }

        // Vertex positions in MCS.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexPos'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexPos']);

        // Vertex normals in MCS.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(attribLocs['aVertexNormal'], 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocs['aVertexNormal']);

        // Indices.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const vertexCount = this.indices.length;
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
}
