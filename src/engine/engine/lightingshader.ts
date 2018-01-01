import Shader from './shader'
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';
import Camera from "./camera";
import Light from "./light";

export default class LightingShader extends Shader {

    constructor(gl: WebGLRenderingContext,
                name: string,
                optional?: object) {
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
        super(gl, vert, frag, name, attributes, uniforms, optional);
        return this;
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

    // TODO: to be extended to support three lights at most.
    setLights(lights: Light[]) {
        const gl = this.getGL();
        if(lights[0] !== undefined && lights[0].isOn()) {
            const uniformLocations = this.getUniformLocations();
            gl.uniform3fv(uniformLocations["uLightPos_world"], new Float32Array(lights[0].getPosition()));
            gl.uniform3fv(uniformLocations["uLightColor"], new Float32Array(lights[0].getColor()));
            gl.uniform1f(uniformLocations["uLightAmbientCoeff"], lights[0].getAmbientCoeff());
        }
    }

    setCamera(camera: Camera) {
        const gl = this.getGL();
        gl.uniform3fv(this.getUniformLocations()["uCameraPos_world"], camera.getPosition());
    }
}
