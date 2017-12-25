/*
 * created by Zhenyun Yu.
 */
import {log} from './engine'

/*
 * write new shaders with the convention here, or subclass this class.
 */
export default class Shader {
    protected gl: WebGLRenderingContext;
    private ok: boolean;
    private readonly program: WebGLProgram;

    // TODO: init them
    protected readonly attribLocations: { [key: string]: number };
    protected readonly uniformLocations: { [key: string]: WebGLUniformLocation };
    private readonly name: string;

    protected readonly attributes: string[];
    protected readonly uniforms: string[];

    constructor(gl: WebGLRenderingContext,
                vert: string,
                frag: string,
                name?: string,
                attributes?: string[],
                uniforms?: string[],
                optional?: object) {
        if (optional) {
            log.error("optional shaders are not implemented");
        }
        if (name) {
            this.name = name;
        } else {
            this.name = 'BaseShader';
        }
        this.gl = gl;
        this.ok = false;
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vertShader, vert);
        gl.shaderSource(fragShader, frag);
        gl.compileShader(vertShader);
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            log.error(gl.getShaderInfoLog(vertShader));
            return this;
        }
        gl.compileShader(fragShader);
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            log.error(gl.getShaderInfoLog(fragShader));
            return this;
        }

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            log.error(gl.getProgramInfoLog(shaderProgram));
            return this;
        }

        log.info("success in build shader");
        this.ok = true;
        this.program = shaderProgram;
        // TODO: make it flexible.
        if (attributes === undefined && uniforms === undefined) {
            this.initAttribLocationsForPrimitive();
            this.attributes = ['aVertexLocation', 'aVertexColor'];
            this.uniforms = ['uModelViewMatrix', 'uProjectionMatrix'];
        }
        return this;
    }

    // TODO: refactor here.
    private initAttribLocationsForPrimitive() {
        const gl = this.gl;

        this.attribLocations['aVertexLocation'] = gl.getAttribLocation(this.program, 'aVertexLocation');
        this.attribLocations['aVertexColor'] = gl.getAttribLocation(this.program, 'aVertexColor');

        this.uniformLocations['uModelViewMatrix'] = gl.getUniformLocation(this.program, 'uModelViewMatrix');
        this.uniformLocations['uProjectionMatrix'] = gl.getUniformLocation(this.program, 'uProjectionMatrix');
    }

    getAttribLocations() {
        return this.attribLocations;
    }

    getUniformLocations() {
        return this.uniformLocations;
    }

    getProjectionMatrixLocation() {
        return this.getUniformLocations()['uProjectionMatrix'];
    }

    getModelViewMatrixLocation() {
        return this.getUniformLocations()['uModelViewMatrix'];
    }

    getShaderProgram(): WebGLProgram {
        if (!this.ok) {
            log.error("getting invalid shader");
            return;
        }
        return this.program;
    }

    valid(): boolean {
        return this.ok;
    }

    use(): void {
        this.gl.useProgram(this.program);
    }
}
