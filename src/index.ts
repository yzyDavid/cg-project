/*
 * created by Zhenyun Yu.
 */
import './index.css';
import {Engine, Scene, Camera} from './engine';
import {makeDemoCube} from './engine';
import * as config from './config';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

const fov = 45 * Math.PI / 180;
const aspect = config.WIDTH / config.HEIGHT;
const near = 0.1;
const far = 100.0;
const camera = new Camera([0.0, 0.0, 2.0], fov, aspect, near, far);

const scene = new Scene(camera);

const cube = makeDemoCube();
scene.addObject(cube);

const conf = {
    width: config.WIDTH,
    height: config.HEIGHT
};
const engine = new Engine(scene, canvas, conf);

const keyController = engine.getKeyEventController();
const timeController = engine.getTimeEventController();

keyController.addListener('q', () => engine.stop());
keyController.enable();

engine.start();

// try to draw a demo cube here:

