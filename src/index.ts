/*
 * created by Zhenyun Yu.
 */
import './index.css';
import {Engine, Scene} from './engine/index';
import * as config from './config';
import {makeDemoCube} from './engine/engine/geometryobject';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

const scene = new Scene();

const cube = makeDemoCube();
scene.addObject(cube);

const engine = new Engine(scene, canvas, undefined);
const keyController = engine.getKeyEventController();
const timeController = engine.getTimeEventController();

keyController.addListener('q', () => engine.stop());
keyController.enable();

engine.start();

// try to draw a demo cube here:

