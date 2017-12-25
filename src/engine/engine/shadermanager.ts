/*
 * created by Zhenyun Yu.
 */
import {log} from './engine';
import Shader from './shader';

import primitiveVertexShaderText from '../shaders/primitive.vert';
import primitiveFragmentShaderText from '../shaders/primitive.frag';

export default class ShaderManager {
    private gl: WebGLRenderingContext;
    private shaders: object;

    constructor(gl, loadDefaults) {
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

    addShader(name, shader) {
        if (shader instanceof Shader) {
            if (!this.shaders[name]) {
                this.shaders[name] = shader;
            } else {
                log.error("shader exists");
            }
        } else {
            log.error("not a instance of Shader class");
        }
    }

    useShader(name: string) {
        const gl = this.gl;
        const shader = this.shaders[name];
        if (shader) {
            shader.use();
        } else {
            log.error("shader " + name + " not found");
        }
    }

    getShader(name) {
        return this.shaders[name];
    }
}
