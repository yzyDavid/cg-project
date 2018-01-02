/*
 * created by Zhenyun Yu.
 */
import './index.css';
import * as config from './config';

import {Engine, Scene, Camera} from './engine';
import {makeDemoLightedCube} from './engine';
import {Pos} from './engine';
import Shader from "./engine/engine/shader";
import {ObjLoader} from './engine';
import {makeDemoCube} from './engine';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

const fov = 45 * Math.PI / 180;
const aspect = config.WIDTH / config.HEIGHT;
const near = 0.1;
const far = 100.0;

const pos: Pos = [3.0, 2.0, 5.0];

const camera = new Camera(pos, fov, aspect, near, far);
camera.lookAt([0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

const scene = new Scene(camera);

const tmp = new ObjLoader("./assets/module/cube.obj", 1, false, "./assets/module/wood11.jpg");
console.log("objlike", tmp);
const cube0 = tmp.getObj();
scene.addObject(cube0);

// const cube = makeDemoCube();
// console.log("objlike2",cube);
// scene.addObject(cube);

const conf = {
    shader: 'texture',
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

