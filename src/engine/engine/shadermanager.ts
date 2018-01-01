/*
 * created by Zhenyun Yu.
 */
import Shader from './shader';
import PrimitiveShader from "./primitiveshader";

export default class ShaderManager {
    private readonly gl: WebGLRenderingContext;
    private readonly shaders: { [key: string]: Shader };
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
        this.addShader(new PrimitiveShader(gl, 'primitive'));
    }

    addShader(shader: Shader) {
        const name = shader.getName();
        if (!this.shaders[name]) {
            this.shaders[name] = shader;
        } else {
            console.error("shader exists");
        }
    }

    useShader(name: string): boolean {
        if (this.currentName === name) {
            return true;
        }
        const gl = this.gl;
        const shader = this.shaders[name];
        if (shader) {
            shader.use();
            this.currentName = name;
            return true;
        } else {
            console.error("shader " + name + " not found");
            return false;
        }
    }

    currentShader(): Shader {
        return this.shaders[this.currentName];
    }

    getShader(name: string) {
        return this.shaders[name];
    }
}
