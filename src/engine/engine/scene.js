/*
 * created by Zhenyun Yu.
 */

export default class Scene {
    constructor() {
        this._camera = null;
        this._gameObjects = [];
    }

    addObject(obj) {
    }

    setCamera(camera) {
    }

    getCamera() {
    }

    forEach(func) {
        this._gameObjects.forEach(func);
    }

    draw() {
        //TODO: maybe abandoned
    }
}
