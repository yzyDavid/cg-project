/*
 * created by Zhenyun Yu.
 */

import getLogger, {Logger} from './logger'

export default class Engine {
    constructor(scene, canvas) {
        this._scene = scene;
        this._canvas = canvas;
        this._gl = null;
    }

    init() {

    }

    start() {

    }
}

const log = getLogger('ENGINE', Logger.DEBUG);

export {log};
