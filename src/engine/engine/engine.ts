/*
 * created by Zhenyun Yu.
 */

import {defaultEngineConfig} from './config';
import KeyEventController from './keyevent';
import ShaderManager from './shadermanager';
import TimeEventController from './timeevent';
import Scene from './scene';
import {mat4} from '../matrix'
import {Drawable} from './component';

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

    constructor(scene: Scene, canvas: HTMLCanvasElement, config: { [entry: string]: any }) {
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
            console.error('get canvas context failed!');
            return this;
        }
        if (!gl) {
            console.error('init webGL failed!');
            return this;
        }
        this.gl = gl;
        this.keyEventController = new KeyEventController();
        this.timeEventController = new TimeEventController();
        this.shaderManager = new ShaderManager(gl);
        console.info("engine constructed");
    }

    init() {
        //TODO: maybe removed
        console.info("engine initialized");
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

        console.info("engine started");
        this.animationRequest = window.requestAnimationFrame(this.render.bind(this));
    }

    stop() {
        window.cancelAnimationFrame(this.animationRequest);
    }

    private render(now: number) {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;
        this.draw(deltaTime);
        if (this.timeEventController.isEnabled()) {
            this.timeEventController.getCallback()(now, deltaTime);
        }
        this.animationRequest = window.requestAnimationFrame(this.render.bind(this));
    }

    private draw(deltaTime: number) {
        const gl = this.gl;
        const scene = this.scene;
        const shader = this.shaderManager.currentShader();

        const perspective = scene.getPerspectiveMatrix();
        const viewMat = scene.hasCamera() ? scene.getCamera().getViewMatrix() : mat4.identity();

        const projectionLoc = shader.getProjectionMatrixLocation();
        const viewLoc = shader.getViewMatrixLocation();
        gl.uniformMatrix4fv(projectionLoc, false, new Float32Array(perspective));
        gl.uniformMatrix4fv(viewLoc, false, new Float32Array(viewMat));

        scene.forEach((obj) => {
            if ('draw' in obj) {
                const d = <Drawable>(obj as any);
                d.draw(gl, this);
            }
            obj.drawChildren(gl, this);
        });
    }

    getStartTime() {
        return this.startTime;
    }

    getScene() {
        return this.scene;
    }

    getShaderManager() {
        return this.shaderManager;
    }

    getCurrentShader() {
        return this.shaderManager.currentShader();
    }

    getKeyEventController() {
        return this.keyEventController;
    }

    getTimeEventController() {
        return this.timeEventController;
    }
}

