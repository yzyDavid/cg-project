/*
 * created by Zhenyun Yu.
 */
import Shader from './shader';
import LightingShader from './lightingshader';

import * as primitiveVertexShaderText from '../shaders/primitive.vert';
import * as primitiveFragmentShaderText from '../shaders/primitive.frag';

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

        this.addShader('lighting', new LightingShader(gl));
    }

    loadDefaultShaders() {
        const gl = this.gl;
        const vert = <string>(primitiveVertexShaderText as any);
        const frag = <string>(primitiveFragmentShaderText as any);
        console.log("loading default Shader");
        console.log(gl);
        console.debug(frag);
        console.debug(vert);
        this.addShader('primitive', new Shader(
            gl,
            vert,
            frag,
            'primitive'
        ));
    }

    addShader(name: string, shader: Shader) {
        if (!this.shaders[name]) {
            this.shaders[name] = shader;
        } else {
            console.error("shader exists");
        }
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
