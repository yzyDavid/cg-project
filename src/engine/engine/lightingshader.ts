import Shader from './shader'
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';
import PointLight from "./pointlight";
import Camera from "./camera";
import Light from "./light";
import DirectLight from "./directlight";

export const NUM_POINT_LIGHTS = 4;
export const NUM_DIRECT_LIGHTS = 4;

export default class LightingShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        const vert = <string>(lightingVertexShaderText as any);
        const frag = <string>(lightingFragmentShaderText as any);
        const attributes = [
            'aVertexPos',
            'aVertexNormal',
            'aTexCoord',
        ];
        const uniforms = [
            'uModelMatrix',
            'uViewMatrix',
            'uProjectionMatrix',
            'uModelNormalMatrix',
            'uCameraPos',
            'uMaterial.ambient',
            'uMaterial.diffuse',
            'uMaterial.specular',
            'uMaterial.shininess',
            'uMaterial.useDiffuseMap',
            'uMaterial.diffuseMap',
        ];

        for (let i = 0; i < NUM_POINT_LIGHTS; i++) {
            uniforms.push(pointLightAttrNameValid(i));
            uniforms.push(pointLightAttrNamePos(i));
            uniforms.push(pointLightAttrNameColor(i));
            uniforms.push(pointLightAttrNameAmbientCoeff(i));
        }

        for (let i = 0; i < NUM_DIRECT_LIGHTS; i++) {
            uniforms.push(directLightAttrNameValid(i));
            uniforms.push(directLightAttrNameDir(i));
            uniforms.push(directLightAttrNameColor(i));
            uniforms.push(directLightAttrNameAmbientCoeff(i));
        }

        super(gl, vert, frag, 'lighting', attributes, uniforms);
        return this;
    }

    setLights(lights: Light[]) {
        const gl = this.gl;
        const uniformLocations = this.getUniformLocations();
        let pointLightCnt = 0;
        let directLightCnt = 0;

        for (let i = 0, len = lights.length; i < len; i++) {
            const light = lights[i];
            if (!light.isOn())
                continue;
            if (light instanceof PointLight) {
                if (pointLightCnt >= NUM_POINT_LIGHTS)
                    continue;
                const pointLight = <PointLight>light;
                gl.uniform1f(uniformLocations[pointLightAttrNameValid(pointLightCnt)], 1.0);
                gl.uniform3fv(uniformLocations[pointLightAttrNamePos(pointLightCnt)], new Float32Array(pointLight.getPosition()));
                gl.uniform3fv(uniformLocations[pointLightAttrNameColor(pointLightCnt)], new Float32Array(pointLight.getColor()));
                gl.uniform1f(uniformLocations[pointLightAttrNameAmbientCoeff(pointLightCnt)], pointLight.getAmbientCoeff());
                pointLightCnt++;
            } else if (light instanceof DirectLight) {
                if (directLightCnt >= NUM_DIRECT_LIGHTS)
                    continue;
                const directLight = <DirectLight>light;
                gl.uniform1f(uniformLocations[directLightAttrNameValid(directLightCnt)], 1.0);
                gl.uniform3fv(uniformLocations[directLightAttrNameDir(directLightCnt)], new Float32Array(directLight.getDirection()));
                gl.uniform3fv(uniformLocations[directLightAttrNameColor(directLightCnt)], new Float32Array(directLight.getColor()));
                gl.uniform1f(uniformLocations[directLightAttrNameAmbientCoeff(directLightCnt)], directLight.getAmbientCoeff());
                directLightCnt++;
            }
        }

        for (let i = pointLightCnt; i < NUM_POINT_LIGHTS; i++) {
            gl.uniform1f(uniformLocations[pointLightAttrNameValid(i)], 0.0);
        }
        for (let i = directLightCnt; i < NUM_DIRECT_LIGHTS; i++) {
            gl.uniform1f(uniformLocations[directLightAttrNameValid(i)], 0.0);
        }
    }

    setCamera(camera: Camera) {
        const gl = this.gl;
        gl.uniform3fv(this.getUniformLocations()["uCameraPos"], camera.getPosition());
    }
}

function pointLightAttrNameValid(i: number): string {
    return "uPointLights[" + i + "].valid";
}

function pointLightAttrNamePos(i: number): string {
    return "uPointLights[" + i + "].position";
}

function pointLightAttrNameColor(i: number): string {
    return "uPointLights[" + i + "].color";
}

function pointLightAttrNameAmbientCoeff(i: number): string {
    return "uPointLights[" + i + "].ambientCoeff";
}

function directLightAttrNameValid(i: number): string {
    return "uDirectLights[" + i + "].valid";
}

function directLightAttrNameDir(i: number): string {
    return "uDirectLights[" + i + "].direction";
}

function directLightAttrNameColor(i: number): string {
    return "uDirectLights[" + i + "].color";
}

function directLightAttrNameAmbientCoeff(i: number): string {
    return "uDirectLights[" + i + "].ambientCoeff";
}