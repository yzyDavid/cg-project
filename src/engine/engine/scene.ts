/*
 * created by Zhenyun Yu.
 */

import Camera from "./camera";
import {Component} from "./component";

export default class Scene {
    private camera: Camera;
    private gameObjects: Component[];

    constructor() {
        this.camera = null;
        this.gameObjects = [];
    }

    addObject(obj) {
    }

    setCamera(camera) {
    }

    getCamera() {
    }

    forEach(func) {
        this.gameObjects.forEach(func);
    }

    draw() {
        //TODO: maybe abandoned
    }
}
