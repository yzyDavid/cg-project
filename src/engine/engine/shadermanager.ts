/*
 * created by Zhenyun Yu.
 */
import {log} from './engine';
import Shader from './shader';

import primitiveVertexShaderText from '../shaders/primitive.vert';
import primitiveFragmentShaderText from '../shaders/primitive.frag';

export default class ShaderManager {
    private gl: WebGLRenderingContext;
    private shaders: { [key: string]: Shader };
    private currentName: string;

    constructor(gl: WebGLRenderingContext, loadDefaults?: boolean) {
        this.gl = gl;
        this.shaders = {};
        if (loadDefaults || loadDefaults === undefined) {
            this.loadDefaultShaders();
        }
    }

    loadDefaultShaders() {
        const gl = this.gl;
        this.addShader('primitive', new Shader(
            gl,
            primitiveVertexShaderText,
            primitiveFragmentShaderText,
            'primitive'
        ));
    }

    addShader(name: string, shader: Shader) {
        if (!this.shaders[name]) {
            this.shaders[name] = shader;
        } else {
            log.error("shader exists");
        }
    }

    useShader(name: string) {
        const gl = this.gl;
        const shader = this.shaders[name];
        if (shader) {
            shader.use();
            this.currentName = name;
        } else {
            log.error("shader " + name + " not found");
        }
    }

    currentShader(): Shader {
        return this.shaders[this.currentName];
    }

    getShader(name: string) {
        return this.shaders[name];
    }
}
