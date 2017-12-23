/*
 * created by Zhenyun Yu.
 */
import {log} from './engine';
import Shader from "./shader";

export default class ShaderManager {
    constructor(gl) {
        this._gl = gl;
        this._shaders = {};
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

    useShader(name) {
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
