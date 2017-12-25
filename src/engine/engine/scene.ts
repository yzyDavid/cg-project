/*
 * created by Zhenyun Yu.
 */

import Camera from "./camera";
import {Component} from "./component";

export default class Scene {
    private camera: Camera;
    private gameObjects: Component[];

    constructor(camera?: Camera) {
        this.camera = camera || null;
        this.gameObjects = [];
    }

    addObject(obj) {
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    getCamera(): Camera {
        return this.camera;
    }

    forEach(func) {
        this.gameObjects.forEach(func);
    }

    draw() {
        //TODO: maybe abandoned
    }
}
