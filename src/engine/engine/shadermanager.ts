/*
 * created by Zhenyun Yu.
 */
import Shader from './shader';

import * as primitiveVertexShaderText from '../shaders/primitive.vert';
import * as primitiveFragmentShaderText from '../shaders/primitive.frag';
import * as lightingVertexShaderText from '../shaders/lighting.vert';
import * as lightingFragmentShaderText from '../shaders/lighting.frag';

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
        let name: string;
        let vert: string;
        let frag: string;

        console.log("loading default Shader");

        // Load primitive shader.
        name = 'primitive';
        vert = <string>(primitiveVertexShaderText as any);
        frag = <string>(primitiveFragmentShaderText as any);
        console.log(gl);
        console.log(name);
        console.debug(vert);
        console.debug(frag);
        this.addShader(name, new Shader(
            gl,
            vert,
            frag,
            name
        ));

        // Load lighting shader.
        name = 'lighting';
        vert = <string>(lightingVertexShaderText as any);
        frag = <string>(lightingFragmentShaderText as any);
        console.log(gl);
        console.log(name);
        console.debug(vert);
        console.debug(frag);
        this.addShader(name, new Shader(
            gl,
            vert,
            frag,
            name
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
