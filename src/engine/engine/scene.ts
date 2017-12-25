/*
 * created by Zhenyun Yu.
 */

import Camera from "./camera";
import {Component} from "./component";

export default class Scene {
    _camera: Camera;
    _gameObjects: Component[];

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
