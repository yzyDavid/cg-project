/*
 * created by Zhenyun Yu.
 */

import Camera from './camera';
import {Component, EnumerableChildren} from './component';
import {mat, mat4} from '../matrix';
import Light from './light';

export default class Scene implements EnumerableChildren<Component> {
    private camera: Camera;
    private gameObjects: Component[];
    private lights: Light[];

    constructor(camera?: Camera) {
        this.camera = camera || null;
        this.gameObjects = [];
    }

    addObject(obj: Component) {
        this.gameObjects.push(obj);
        if (obj instanceof Light) {
            this.lights.push(obj);
        }
    }

    removeObject(obj: Component) {
        if (obj instanceof Light) {
            const index = this.lights.indexOf(obj);
            if (index !== -1) {
                this.lights.splice(index, 1);
            }
        }
        const index = this.gameObjects.indexOf(obj);
        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }
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

    getLights(): Light[] {
        return this.lights;
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
