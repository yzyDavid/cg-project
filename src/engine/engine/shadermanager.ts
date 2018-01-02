/*
 * created by Zhenyun Yu.
 */

import Shader from './shader';
import LightingShader from './lightingshader';
import PrimitiveShader from './primitiveshader';
import TextureShader from "./textureshader";

export default class ShaderManager {
    private readonly gl: WebGLRenderingContext;
    private readonly shaders: { [key: string]: Shader };
    private currentName: string;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.shaders = {};

        this.addShader(new LightingShader(gl));
        this.addShader(new PrimitiveShader(gl));
        this.addShader(new TextureShader(gl));
    }

    addShader(shader: Shader) {
        this.shaders[shader.getName()] = shader;
    }

    useShader(name: string) {
        if (this.currentName === name) {
            return;
        }
        const gl = this.gl;
        const shader = this.shaders[name];
        if (shader) {
            shader.use();
            this.currentName = name;
        } else {
            console.error("shader " + name + " not found");
        }
    }

    currentShader(): Shader {
        return this.shaders[this.currentName];
    }

    getShader(name: string) {
        return this.shaders[name];
    }
}
