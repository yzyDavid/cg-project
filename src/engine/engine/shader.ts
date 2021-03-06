/*
 * created by Zhenyun Yu.
 */

/*
 * Shaders should subclass this class.
 */
export default abstract class Shader {
    protected gl: WebGLRenderingContext;
    private ok: boolean;
    private readonly program: WebGLProgram;

    protected readonly attribLocations: { [key: string]: number };
    protected readonly uniformLocations: { [key: string]: WebGLUniformLocation };
    private readonly name: string;

    protected readonly attributes: string[];
    protected readonly uniforms: string[];

    constructor(gl: WebGLRenderingContext,
                vert: string,
                frag: string,
                name: string,
                attributes: string[],
                uniforms: string[]) {
        this.name = name;
        console.log("init shader: " + this.name);
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

        this.attributes = attributes;
        this.uniforms = uniforms;

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

    getAttribLocations() {
        return this.attribLocations;
    }

    getUniformLocations() {
        return this.uniformLocations;
    }

    getVertexPositionLocation() {
        const r = this.getAttribLocations()['aVertexPosition'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getProjectionMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uProjectionMatrix'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getModelMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uModelMatrix'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

    getViewMatrixLocation(): WebGLUniformLocation {
        const r = this.getUniformLocations()['uViewMatrix'];
        if (!r) {
            throw new Error();
        }
        return r;
    }

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
        console.log(a);
        console.log("using shader: " + this.name);
    }

    getName(): string {
        return this.name;
    }
}
