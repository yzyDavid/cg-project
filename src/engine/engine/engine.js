/*
 * created by Zhenyun Yu.
 */

import getLogger, {Logger} from './logger'
import {defaultEngineConfig} from './config';
import KeyEventController from './keyevent';
import ShaderManager from './shadermanager';
import TimeEventController from './timeevent';
import {mat4, glMatrix} from 'gl-matrix/src/gl-matrix';

export default class Engine {
    constructor(scene, canvas, config) {
        const _conf = defaultEngineConfig();
        for (let conf in config) {
            if (config.hasOwnProperty(conf)) {
                _conf[conf] = config[conf];
            }
        }
        this._config = _conf;
        this._scene = scene;
        this._canvas = canvas;
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
        this._keyEventController = new KeyEventController();
        this._timeEventController = new TimeEventController();
        this._shaderManager = new ShaderManager(gl);
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
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this._shaderManager.useShader(this._config.shader);

        const projMat = mat4.create();

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
        if (this._timeEventController.isEnabled()) {
            this._timeEventController.getCallback()();
        }
        this._animationRequest = window.requestAnimationFrame(this._render.bind(this));
    }

    _draw(deltaTime) {
        const gl = this._gl;
        const scene = this._scene;
        scene.forEach((obj) => {
            if (obj.draw !== undefined) {
                obj.draw();
            }
        });
    }

    getStartTime() {
        return this._startTime;
    }

    getScene() {
        return this._scene;
    }

    getKeyEventController() {
        return this._keyEventController;
    }

    getTimeEventController() {
        return this._timeEventController;
    }
}

const log = getLogger('ENGINE', Logger.DEBUG);

export {log};
