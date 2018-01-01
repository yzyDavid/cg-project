/*
 * created by Zhenyun Yu.
 */

/*
 * write new shaders with the convention here, or subclass this class.
 */
import {Pos} from "./public";
import Light from "./light";
import construct = Reflect.construct;

export default abstract class Shader {
    private gl: WebGLRenderingContext;
    private ok: boolean;
    private readonly program: WebGLProgram;

    private readonly attribLocations: { [key: string]: number };
    private readonly uniformLocations: { [key: string]: WebGLUniformLocation };
    private readonly name: string;

    private readonly attributes: string[];
    private readonly uniforms: string[];

    constructor(gl: WebGLRenderingContext,
                vert: string,
                frag: string,
                name: string,
                attributes?: string[],
                uniforms?: string[],
                optional?: object) {
        if (optional) {
            console.error("optional shaders are not implemented");
        }
        this.name = name;
        console.log("init shader: " + this.name);
        console.log(gl);
        console.debug(frag);
        console.debug(vert);
        this.gl = gl;
        this.ok = false;
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vertShader, vert);
        gl.shaderSource(fragShader, frag);
        gl.compileShader(vertShader);
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertShader));
            return this;
        }
        gl.compileShader(fragShader);
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragShader));
            return this;
        }

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(shaderProgram));
            return this;
        }

        console.info("success in build shader");
        this.ok = true;
        this.program = shaderProgram;

        this.attribLocations = {};
        this.uniformLocations = {};

        if (attributes === undefined || attributes === null) {
            console.info("shader init: load default attribute locations.");
            this.attributes = ['aVertexPosition', 'aVertexColor'];
        } else {
            this.attributes = attributes;
        }

        if (uniforms === undefined || uniforms === null) {
            console.info("shader init: load default uniform locations.");
            this.uniforms = ['uModelMatrix', 'uViewMatrix', 'uProjectionMatrix'];
        } else {
            this.uniforms = uniforms;
        }

        this.initLocations();
        console.log("attributes:");
        console.log(this.attribLocations);
        console.log("uniforms:");
        console.log(this.uniformLocations);
        return this;
    }

    private initLocations() {
        const gl = this.gl;
        this.attributes.forEach((o) => {
            this.attribLocations[o] = gl.getAttribLocation(this.program, o);
        });
        this.uniforms.forEach((o) => {
            this.uniformLocations[o] = gl.getUniformLocation(this.program, o);
        });
    }

    protected getGL(): WebGLRenderingContext {
        return this.gl;
    }

    getName(): string {
        return this.name;
    }

    getAttribLocations() {
        return this.attribLocations;
    }

    getUniformLocations() {
        return this.uniformLocations;
    }

    abstract getVertexPositionLocation(): number;

    abstract getProjectionMatrixLocation(): WebGLUniformLocation;

    abstract getModelMatrixLocation(): WebGLUniformLocation;

    abstract getViewMatrixLocation(): WebGLUniformLocation;

    getShaderProgram(): WebGLProgram {
        if (!this.ok) {
            console.error("getting invalid shader");
            return;
        }
        return this.program;
    }

    valid(): boolean {
        return this.ok;
    }

    use(): void {
        // NOTE: this method should not be invoked by user, only should be invoked by ShaderManager.
        this.gl.useProgram(this.program);
        const a = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        console.log("using shader: return value of gl.ACTIVE_ATTRIBUTES");
        console.debug(a);
    }
}
