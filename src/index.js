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

engine.start();
