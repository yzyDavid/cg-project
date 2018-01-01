/*
 * created by Zhenyun Yu.
 */

import * as primitiveVertexShaderText from '../shaders/primitive.vert';
import * as primitiveFragmentShaderText from '../shaders/primitive.frag';

import Shader from './shader';

export default class PrimitiveShader extends Shader {
    constructor(gl: WebGLRenderingContext) {
        const attributes = ['aVertexPosition', 'aVertexColor'];
        const uniforms = ['uModelMatrix', 'uViewMatrix', 'uProjectionMatrix'];
        const vert = <string>(primitiveVertexShaderText as any);
        const frag = <string>(primitiveFragmentShaderText as any);
        super(gl, vert, frag, 'primitive', attributes, uniforms);
    }
}
