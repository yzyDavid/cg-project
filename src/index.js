/*
 * created by Zhenyun Yu.
 */
import './index.css';
import * as config from './config';
import {initShaders} from "./shader";

let gl;

function initWebGL(canvas) {
    let gl;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
        alert('get canvas context failed!');
    }
    if (!gl) {
        alert('init webGL failed!');
    }
    return gl;
}

function start() {
    const canvas = document.getElementById('root');
    canvas.setAttribute('width', config.WIDTH);
    canvas.setAttribute('height', config.HEIGHT);
    gl = initWebGL(canvas);
    if (!gl) {
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initShaders(gl);

    alert('init success');
}

document.getElementById('main-body').onload = start;
