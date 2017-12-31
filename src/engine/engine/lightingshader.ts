import Shader from './shader'
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';
import Camera from "./camera";
import {Pos} from "./public";
import Light from "./light";

export default class LightingShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        const vert = <string>(lightingVertexShaderText as any);
        const frag = <string>(lightingFragmentShaderText as any);
        const attributes = [
            'aVertexPos_model',
            'vVertexNormal_model',
        ];
        const uniforms = [
            'uModelMatrix',
            'uViewMatrix',
            'uProjectionMatrix',
            'uModelNormalMatrix',
            'uCameraPos_world',
            'uLightPos_world',
            'uLightColor',
            'uLightAmbientCoeff',
            'uMaterialAmbientColor',
            'uMaterialDiffuseColor',
            'uMaterialSpecularColor',
            'uMaterialShininess',
        ];
        super(gl, vert, frag, 'lighting', attributes, uniforms);
        return this;
    }

    getAttribLocations() {
        return this.attribLocations;
    }

    getUniformLocations() {
        return this.uniformLocations;
    }

    getVertexPositionLocation() {
        const r = this.getAttribLocations()['aVertexPos_model'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getProjectionMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uProjectionMatrix'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getModelMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uModelMatrix'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getViewMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uViewMatrix'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    setLights(gl: WebGLRenderingContext, lights: Light[]) {
        if (lights.length > 3) {
            throw new Error();
        }

        // TODO: to be extend to support 3 lights.
        // Light 0.
        const uniformLocations = this.getUniformLocations();
        gl.uniform3fv(uniformLocations["uLightPos_world"], new Float32Array(lights[0].getPosition()));
        gl.uniform3fv(uniformLocations["uLightColor"], new Float32Array(lights[0].getColor()));
        gl.uniform1f(uniformLocations["uLightAmbientCoeff"], lights[0].getAmbientCoeff());
    }

    setCameraPos(gl: WebGLRenderingContext, pos: Pos) {
        gl.uniform3fv(this.getUniformLocations()["uCameraPos_world"], pos);
    }
}
