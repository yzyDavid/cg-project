/*
 * created by Zhenyun Yu.
 */

import getLogger, {Logger} from './logger'
import KeyEventController from './keyevent';
import ShaderManager from './shadermanager';

export default class Engine {
    constructor(scene, canvas) {
        this._scene = scene;
        this._canvas = canvas;
        this._keyEventController = new KeyEventController();
        this._shaderManager = new ShaderManager();
        let gl;
        try {
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        } catch (e) {
            log.error('get canvas context failed!');
            return this;
        }
        if (!gl) {
            log.error('init webGL failed!');
            return this;
        }
        this._gl = gl;
        log.info("engine constructed");
    }

    init() {
        //TODO: maybe removed
        log.info("engine initialized");
    }

    start() {
        const gl = this._gl;

        this._startTime = Date.now();
        this._then = this._startTime * 0.001;

        gl.clearColor(0.4, 0.4, 0.4, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        log.info("engine started");
        this._animationRequest = window.requestAnimationFrame(this._render.bind(this));
    }

    stop() {
        window.cancelAnimationFrame(this._animationRequest);
    }

    _render(now) {
        now *= 0.001;
        const deltaTime = now - this._then;
        this._then = now;
        this._draw(deltaTime);
        this._animationRequest = window.requestAnimationFrame(this._render.bind(this));
    }

    _draw(deltaTime) {
    }

    getStartTime() {
        return this._startTime;
    }

    getScene() {
        return this._scene;
    }

    setOnUpdate(func) {
    }
}

const log = getLogger('ENGINE', Logger.DEBUG);

export {log};
