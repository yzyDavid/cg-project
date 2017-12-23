/*
 * created by Zhenyun Yu.
 */

import getLogger, {Logger} from './logger'

export default class Engine {
    constructor(scene, canvas) {
        this._scene = scene;
        this._canvas = canvas;
        this._gl = null;
        log.info("engine constructed");
    }

    init() {
        log.info("engine initialized");
    }

    start() {
        log.info("engine started");
    }

    getScene() {
        return this._scene;
    }
}

const log = getLogger('ENGINE', Logger.DEBUG);

export {log};
