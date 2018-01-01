import * as primitiveVertexShaderText from '../shaders/primitive.vert';
import * as primitiveFragmentShaderText from '../shaders/primitive.frag';
import Shader from "./shader";

export default class PrimitiveShader extends Shader {

    constructor(gl: WebGLRenderingContext,
                name: string,
                optional?: object) {
        const vert = <string>(primitiveVertexShaderText as any);
        const frag = <string>(primitiveFragmentShaderText as any);
        const attributes = [
            'aVertexPosition',
            'aVertexColor',
        ];
        const uniforms = [
            'uModelMatrix',
            'uViewMatrix',
            'uProjectionMatrix',
        ];

        super(gl, vert, frag, name, attributes, uniforms, optional);
        return this;
    }

    getVertexPositionLocation() {
        const r = this.getAttribLocations()['aVertexPosition'];
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
}
