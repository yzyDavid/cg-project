/*
 * created by Zhenyun Yu.
 */

import Camera from './camera';
import {Component} from './component';
import {mat, mat4} from '../matrix';

export default class Scene {
    private camera: Camera;
    private gameObjects: Component[];

    constructor(camera?: Camera) {
        this.camera = camera || null;
        this.gameObjects = [];
    }

    addObject(obj: Component) {
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    getCamera(): Camera {
        return this.camera;
    }

    getPerspectiveMatrix(): mat {
        if(this.camera) {
            return this.camera.getPerspectiveMatrix();
        } else {
            return mat4.eyes();
        }
    }

    forEach(func: (o: Component) => void) {
        this.gameObjects.forEach(func);
    }

    draw() {
        //TODO: maybe abandoned
    }
}
