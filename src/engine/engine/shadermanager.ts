/*
 * created by Zhenyun Yu.
 */
import {log} from './engine';
import Shader from './shader';

import primitiveVertexShaderText from '../shaders/primitive.vert';
import primitiveFragmentShaderText from '../shaders/primitive.frag';

export default class ShaderManager {
    _gl: WebGLRenderingContext;
    _shaders: object;

    constructor(gl, loadDefaults) {
        this._gl = gl;
        this._shaders = {};
        if (loadDefaults || loadDefaults === undefined) {
            this.loadDefaultShaders();
        }
    }

    loadDefaultShaders() {
        const gl = this._gl;
        this.addShader('primitive', new Shader(
            gl,
            primitiveVertexShaderText,
            primitiveFragmentShaderText,
            null
        ));
    }

    addShader(name, shader) {
        if (shader instanceof Shader) {
            if (!this._shaders[name]) {
                this._shaders[name] = shader;
            } else {
                log.error("shader exists");
            }
        } else {
            log.error("not a instance of Shader class");
        }
    }

    useShader(name: string) {
        const gl = this._gl;
        const shader = this._shaders[name];
        if (shader) {
            shader.use();
        } else {
            log.error("shader " + name + " not found");
        }
    }

    getShader(name) {
        return this._shaders[name];
    }
}
