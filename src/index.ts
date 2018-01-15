/*
 * created by Zhenyun Yu.
 */

import './index.css';
import * as config from './config';

import {Engine, Scene, Camera, Vec3} from './engine';
import {makeDemoCube} from './engine';
import {makeDemoLightedCube} from './engine';
import {Pos} from './engine';
import {queryObjAsync} from './engine';
import {loadImageAsync} from './engine/utils';
import PointLight from "./engine/engine/pointlight";
import DirectLight from "./engine/engine/directlight";

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

// Initialize camera.
const fov = 45 * Math.PI / 180;
const aspect = config.WIDTH / config.HEIGHT;
const near = 0.1;
const far = 100.0;
const pos: Pos = [3.0, 2.0, 5.0];
const camera = new Camera(pos, fov, aspect, near, far);
camera.lookAt([0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

// Create scene.
const scene = new Scene(camera);

// Add point lights.
const white: Vec3 = [1, 1, 1];
const ambientCoeff: number = 0.2;
const pointLights: PointLight[] = [
    new PointLight([3.0, 2.0, 5.0], white, 0.2, true),
    new PointLight([3.0, 2.0, 5.0], white, 0, false),
    new PointLight([3.0, 2.0, 5.0], white, 0, false),
]
for (let i = 0; i < pointLights.length; i++) {
    scene.addLight(pointLights[i]);
}

// Add direct lights.
const directLights: DirectLight[] = [
    new DirectLight([0, -1, 0], white, 0, false),
    new DirectLight([0, -1, 0], white, 0, false),
    new DirectLight([0, -1, 0], white, 0, false),
]
for (let i = 0; i < directLights.length; i++) {
    scene.addLight(directLights[i]);
}

queryObjAsync("/assets/module/cube.obj").then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
    }
});

// Create engine.
const conf = {
    width: config.WIDTH,
    height: config.HEIGHT
};
const engine = new Engine(scene, canvas, conf);

const keyController = engine.getKeyEventController();
const timeController = engine.getTimeEventController();

keyController.addListener('q', () => engine.stop());
keyController.enable();
timeController.addListener('cameraMove', () => {
    pos[0] += 0.01;
    pos[1] += 0.01;
    camera.setPosition(pos);
    const color = pointLights[0].getColor();
    // pointLights[0].setColor([color[0] - 0.02, color[1] - 0.02, color[2] - 0.02]);
});

keyController.addListener('q', () => engine.stop());

engine.start();
