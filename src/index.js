/*
 * created by Zhenyun Yu.
 */
import './index.css';
import {Engine, Scene} from './engine';

const canvas = document.getElementById('root');
const scene = new Scene();
const engine = new Engine(scene, canvas);
