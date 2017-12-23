/*
 * created by Zhenyun Yu.
 */
import {log} from './engine'

export default class Shader {
    constructor(gl, vert, frag, optional) {
        if (optional) {
            log.error("optional shader not implemented");
        }
        this._ok = false;
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
        this._ok = true;
        this._program = shaderProgram;
        return this;
    }

    getShaderProgram() {
        if (!this._ok) {
            log.error("getting invalid shader");
            return;
        }
        return this._program;
    }
}
