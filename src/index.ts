/*
 * created by Zhenyun Yu.
 */
import './index.css';
import {Engine, Scene} from './engine/index';
import * as config from './config';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

const scene = new Scene();
const engine = new Engine(scene, canvas, undefined);
const keyController = engine.getKeyEventController();
const timeController = engine.getTimeEventController();

keyController.addListener('q', () => engine.stop());
keyController.enable();

timeController.addListener('log', () => console.log(Date.now()));
timeController.enable();

engine.start();
