/*
 * created by Zhenyun Yu.
 */

import Camera from './camera';
import {Component, EnumerableChildren} from './component';
import {mat, mat4} from '../matrix';

export default class Scene implements EnumerableChildren<Component> {
    private camera: Camera;
    private gameObjects: Component[];

    constructor(camera?: Camera) {
        this.camera = camera || null;
        this.gameObjects = [];
    }

    addObject(obj: Component) {
        this.gameObjects.push(obj);
    }

    removeObject(obj: Component) {
        throw new Error();
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    getCamera(): Camera {
        return this.camera;
    }

    hasCamera(): boolean {
        return !!this.camera;
    }

    getPerspectiveMatrix(): mat {
        if (this.camera) {
            return this.camera.getPerspectiveMatrix();
        } else {
            (() => {
                console.info("NO camera assigned, return an eyes matrix as default");
            })();
            return mat4.eyes();
        }
    }

    forEach(func: (o: Component, index?: number, array?: Component[]) => void): void {
        this.gameObjects.forEach(func);
    }

    draw() {
        //TODO: maybe abandoned
    }
}
