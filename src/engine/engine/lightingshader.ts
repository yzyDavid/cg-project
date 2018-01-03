import Shader from './shader'
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';
import Camera from "./camera";
import Light from "./light";
import PointLight from "./pointlight";

export const NUM_POINT_LIGHTS = 4;

export default class LightingShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        const vert = <string>(lightingVertexShaderText as any);
        const frag = <string>(lightingFragmentShaderText as any);
        const attributes = [
            'aVertexPos',
            'aVertexNormal',
            'aTextCoord',
        ];
        const uniforms = [
            'uModelMatrix',
            'uViewMatrix',
            'uProjectionMatrix',
            'uModelNormalMatrix',
            'uCameraPos',
            'u_Sampler',
            'uMaterial.ambient',
            'uMaterial.diffuse',
            'uMaterial.specular',
            'uMaterial.shininess',
            'hasText',
            'hasAmbientColor',
            'hasDiffuseColor',
            'hasSpecularColor'
        ];

        for (let i = 0; i < NUM_POINT_LIGHTS; i++) {
            uniforms.push(pointLightAttrNamePos(i));
            uniforms.push(pointLightAttrNameAmbient(i));
            uniforms.push(pointLightAttrNameDiffuse(i));
            uniforms.push(pointLightAttrNameSpecular(i));
        }

        super(gl, vert, frag, 'lighting', attributes, uniforms);
        return this;
    }

    // TODO: to be extended to support three lights at most.
    setLights(lights: Light[]) {
        const gl = this.gl;
        const uniformLocations = this.getUniformLocations();
        let pointLightCnt = 0;

        for (let i=0, len=lights.length; i<len; i++) {
            const light = lights[i];
            if (light instanceof PointLight) {
                if (pointLightCnt >= NUM_POINT_LIGHTS)
                    continue;
                const pointLight = <PointLight>light;
                gl.uniform3fv(uniformLocations[pointLightAttrNamePos(pointLightCnt)], new Float32Array(pointLight.getPosition()));
                gl.uniform3fv(uniformLocations[pointLightAttrNameAmbient(pointLightCnt)], new Float32Array(pointLight.getAmbient()));
                gl.uniform3fv(uniformLocations[pointLightAttrNameDiffuse(pointLightCnt)], new Float32Array(pointLight.getDiffuse()));
                gl.uniform3fv(uniformLocations[pointLightAttrNameSpecular(pointLightCnt)], new Float32Array(pointLight.getSpecular()));
            }
        }

        // TODO: default lights.
    }

    setCamera(camera: Camera) {
        const gl = this.gl;
        gl.uniform3fv(this.getUniformLocations()["uCameraPos"], camera.getPosition());
    }
}

function pointLightAttrNamePos(i: number): string {
    return "uPointLights[" + i + "].position";
}

function pointLightAttrNameAmbient(i: number): string {
    return "uPointLights[" + i + "].ambient";
}

function pointLightAttrNameDiffuse(i: number): string {
    return "uPointLights[" + i + "].diffuse";
}

function pointLightAttrNameSpecular(i: number): string {
    return "uPointLights[" + i + "].specular";
}
