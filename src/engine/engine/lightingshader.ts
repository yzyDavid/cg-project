import Shader from './shader'
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';
import Camera from "./camera";
import Light from "./light";

export default class LightingShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        const vert = <string>(lightingVertexShaderText as any);
        const frag = <string>(lightingFragmentShaderText as any);
        const attributes = [
            'aVertexPos_model',
            'vVertexNormal_model',
            'a_TextCoord'
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
            'u_Sampler',
            'hasText',
            'hasAmbientColor',
            'hasDiffuseColor',
            'hasSpecularColor'
        ];
        super(gl, vert, frag, 'lighting', attributes, uniforms);
        return this;
    }

    // TODO: to be extended to support three lights at most.
    setLights(lights: Light[]) {
        const gl = this.gl;
        if(lights[0] !== undefined && lights[0].isOn()) {
            const uniformLocations = this.getUniformLocations();
            gl.uniform3fv(uniformLocations["uLightPos_world"], new Float32Array(lights[0].getPosition()));
            gl.uniform3fv(uniformLocations["uLightColor"], new Float32Array(lights[0].getColor()));
            gl.uniform1f(uniformLocations["uLightAmbientCoeff"], lights[0].getAmbientCoeff());
        }
    }

    setCamera(camera: Camera) {
        const gl = this.gl;
        gl.uniform3fv(this.getUniformLocations()["uCameraPos_world"], camera.getPosition());
    }
}
