import * as textureVertexShaderText from '../shaders/texture.vert';
import * as textureFragmentShaderText from '../shaders/texture.frag';

import Shader from './shader';

export default class TextureShader extends Shader {
    constructor(gl: WebGLRenderingContext) {
        const attributes = ['aVertexPosition', 'a_TextCoord','u_Sampler'];
        const uniforms = ['uModelMatrix', 'uViewMatrix', 'uProjectionMatrix'];
        const vert = <string>(textureVertexShaderText as any);
        const frag = <string>(textureFragmentShaderText as any);
        super(gl, vert, frag, 'texture', attributes, uniforms);
    }
}