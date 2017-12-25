/*
 * created by Zhenyun Yu.
 */

import getLogger, {Level, Logger} from './logger'
import {defaultEngineConfig} from './config';
import KeyEventController from './keyevent';
import ShaderManager from './shadermanager';
import TimeEventController from './timeevent';
import Scene from './scene';
import {mat4} from '../matrix'

export default class Engine {
    private config: any;
    private scene: Scene;
    private canvas: HTMLCanvasElement;
    private keyEventController: KeyEventController;
    private timeEventController: TimeEventController;
    private shaderManager: ShaderManager;
    private gl: WebGLRenderingContext;
    private startTime: number;
    private then: number;
    private animationRequest: number;

    constructor(scene: Scene, canvas: HTMLCanvasElement, config: object) {
        const _conf = defaultEngineConfig();
        for (let conf in config) {
            if (config.hasOwnProperty(conf)) {
                _conf[conf] = config[conf];
            }
        }
        this.config = _conf;
        this.scene = scene;
        this.canvas = canvas;
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
        this.gl = gl;
        this.keyEventController = new KeyEventController();
        this.timeEventController = new TimeEventController();
        this.shaderManager = new ShaderManager(gl);
        log.info("engine constructed");
    }

    init() {
        //TODO: maybe removed
        log.info("engine initialized");
    }

    start() {
        const gl = this.gl;

        this.startTime = Date.now();
        this.then = this.startTime * 0.001;

        gl.clearColor(0.4, 0.4, 0.4, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.shaderManager.useShader(this.config.shader);

        log.info("engine started");
        this.animationRequest = window.requestAnimationFrame(this._render.bind(this));
    }

    stop() {
        window.cancelAnimationFrame(this.animationRequest);
    }

    _render(now: number) {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;
        this._draw(deltaTime);
        if (this.timeEventController.isEnabled()) {
            this.timeEventController.getCallback()();
        }
        this.animationRequest = window.requestAnimationFrame(this._render.bind(this));
    }

    _draw(deltaTime: number) {
        const gl = this.gl;
        const scene = this.scene;
        scene.forEach((obj) => {
            if (obj.draw !== undefined) {
                obj.draw();
            }
        });
    }

    getStartTime() {
        return this.startTime;
    }

    getScene() {
        return this.scene;
    }

    getKeyEventController() {
        return this.keyEventController;
    }

    getTimeEventController() {
        return this.timeEventController;
    }
}

const log = getLogger('ENGINE', Level.DEBUG);

export {log};
