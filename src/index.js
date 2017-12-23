/*
 * created by Zhenyun Yu.
 */
import './index.css';
import {Engine, Scene} from './engine';
import * as config from './config';

const canvas = document.getElementById('root');
canvas.setAttribute('width', config.WIDTH);
canvas.setAttribute('height', config.HEIGHT);

const scene = new Scene();
const engine = new Engine(scene, canvas);
const keyController = engine.getKeyEventController();
const timeController = engine.getTimeEventController();

keyController.addListener('q', () => engine.stop());
keyController.enable();

timeController.addListener('log', () => console.log(Date.now()));
timeController.enable();

engine.start();
