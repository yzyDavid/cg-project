/*
 * created by Zhenyun Yu.
 */

import getLogger, {Logger} from './logger'
import KeyEventController from "./keyevent";

export default class Engine {
    constructor(scene, canvas) {
        this._scene = scene;
        this._canvas = canvas;
        this._keyEventController = new KeyEventController();
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

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        log.info("engine started");
    }

    getScene() {
        return this._scene;
    }

    setOnUpdate(func) {
    }
}

const log = getLogger('ENGINE', Logger.DEBUG);

export {log};
