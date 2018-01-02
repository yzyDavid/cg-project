/*
 * created by Zhenyun Yu.
 */
import './index.css';
import * as config from './config';

import {Engine, Scene, Camera, Vec3} from './engine';
import {makeDemoCube} from './engine';
import {makeDemoLightedCube} from './engine';
import {Pos} from './engine';
import Light from "./engine/engine/light";
import {ObjLoader} from './engine';
import PointLight from "./engine/engine/pointlight";

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

// Add a light.
const ambient: Vec3 = [0.05,0.05,0.05];
const diffuse: Vec3 = [1,1,1];
const specular: Vec3 = [1,1,1];
const pointLight = new PointLight(pos, ambient, diffuse, specular);
scene.addLight(pointLight);

// Add a demo lighted object.
const lightedCube = makeDemoLightedCube();
scene.addObject(lightedCube);

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
// timeController.addListener('cameraMove', () => {
//     pos[0] += 0.01;
//     pos[1] += 0.01;
//     camera.setPosition(pos);
// });

engine.start();

// try to draw a demo cube here:

