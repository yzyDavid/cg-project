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

import initButtons from './button';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

Promise.resolve(() => initButtons()).then();

// Initialize camera.
const fov = 45 * Math.PI / 180;
const aspect = config.WIDTH / config.HEIGHT;
const near = 0.1;
const far = 100.0;
const pos: Pos = [5, 0, -9];
const camera = new Camera(pos, fov, aspect, near, far);
camera.lookAt([-6, 0, 12], [0.0, 1.0, 0.0]);

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

//垃圾桶
queryObjAsync("/assets/module/poubelleInox.obj", 0.024).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([3.7, -7, -8]);
    }
});

//电脑+柜
queryObjAsync("/assets/module/TVCenter.obj", 0.05).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-5, -4.8, -2]);
        entry.rotate([0, 1, 0], Math.PI * 0.5);
    }
});

//电视柜
queryObjAsync("/assets/module/shelf.obj", 4).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([5, -8.5, 5]);
        entry.rotate([0, 1, 0], Math.PI * 0.5);
    }
});

//TV
queryObjAsync("/assets/module/tv.obj", 0.05).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([6, -2, 6]);
        entry.rotate([0, 1, 0], -Math.PI * 0.5);
    }
});

//窗户
queryObjAsync("/assets/module/window.obj", 0.033).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-2.8, -3.2, -12]);
    }
});

//台灯
queryObjAsync("/assets/module/deskLamp.obj", 0.028).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([0.8, -6.2, -8]);
    }
});
//时钟
queryObjAsync("/assets/module/clock.obj", 0.045).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);

        entry.translate([2, -1, -12]);
        entry.rotate([1, 0, 0], Math.PI * 0.5);
    }
});

//落地灯
queryObjAsync("/assets/module/lamp.obj", 3).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([5.5, -8.5, 0]);
    }
});

//茶几
queryObjAsync("/assets/module/smalltable.obj", 3).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-1.2, -8.5, 5]);
        entry.rotate([0, 1, 0], Math.PI * 0.5);
    }
});

//茶壶
queryObjAsync("/assets/module/teapot.obj", 0.01).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-1.2, -6.74, 6]);
        entry.rotate([0, 1, 0], Math.PI * 0.5);
    }
});

//沙发
queryObjAsync("/assets/module/sofa.obj", 3.6).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-4.4, -8.5, 5]);
        entry.rotate([0, 1, 0], Math.PI * 0.5);
    }
});

//电风扇
queryObjAsync("/assets/module/ceilingFan.obj", 0.06).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-2, 1.5, 0]);
        //entry.rotate([0,1,0],Math.PI*0.5);
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
});

engine.start();
