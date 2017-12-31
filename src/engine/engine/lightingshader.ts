import Shader from './shader'
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';

export default class LightingShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        const vert = <string>(lightingVertexShaderText as any);
        const frag = <string>(lightingFragmentShaderText as any);
        const attributes = [
            'aVertexPos_model',
        ];
        const uniforms = [
            'uModel',
            'uView',
            'uProjection',
            'uMaterialAmbientColor',
            'uMaterialDiffuseColor',
            'uMaterialSpecularColor',
            'uMaterialShininess',
            'uLightPos',
            'uLightColor',
            'uLightAmbientCoeff',
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
        const r = this.getUniformLocations()['uProjection'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getModelMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uModel'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getViewMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uView'];
        if (!r) {
            throw new Error();
        }
        return r;
    }
}
