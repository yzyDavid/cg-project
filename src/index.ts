/*
 * created by Zhenyun Yu.
 */

import './index.css';
import * as config from './config';

import {Engine, Scene, Camera, Vec3, Component} from './engine';
import {Pos} from './engine';
import {queryObjAsync} from './engine';
import PointLight from "./engine/engine/pointlight";
import DirectLight from "./engine/engine/directlight";
import {addObjSaver} from "./engine";
import {EPSILON, vec3, mat4} from "./engine/matrix"

import initButtons from './button';
import {queryColliableObjAsync} from "./engine/engine/objloader";
import saveScreenshot from './screenshot';
import initLightControl from './lightcontrol';
import {Collider} from "./engine/engine/collider";
import {Barrier} from "./engine/engine/component";

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('root');
canvas.setAttribute('width', String(config.WIDTH));
canvas.setAttribute('height', String(config.HEIGHT));

Promise.resolve(() => initButtons()).then();

// Initialize camera.
const fov = 45 * Math.PI / 180;
const aspect = config.WIDTH / config.HEIGHT;
const near = 0.1;
const far = 100.0;
const pos: Pos = [0, 0, 0];
const look: Vec3 = [0, 0, 1];
let up: Vec3 = [0.0, 1.0, 0.0];
let viewX: Vec3 = <Vec3>vec3.normalize(vec3.cross(look, up));
let viewZ: Vec3 = <Vec3>vec3.normalize(look);
let viewY: Vec3 = <Vec3>vec3.cross(viewX, viewZ);
const camera = new Camera(pos, fov, aspect, near, far);
camera.lookAt(look, up);
let door: boolean = false;

// Create scene.
export const scene = new Scene(camera);

// Add point lights.
const pointLights: PointLight[] = [
    new PointLight([3.0, 2.0, 5.0], [1, 1, 1], 0.2, true),
    new PointLight([3.0, 2.0, 5.0], [0, 0, 0], 0, true),
]
for (let i = 0; i < pointLights.length; i++) {
    scene.addLight(pointLights[i]);
}

// Add direct lights.
const directLights: DirectLight[] = [
    new DirectLight([0, -1, 0], [0, 0, 0], 0, true),
    new DirectLight([0, -1, 0], [0, 0, 0], 0, true),
]
for (let i = 0; i < directLights.length; i++) {
    scene.addLight(directLights[i]);
}

queryObjAsync("assets/module/skybox.obj", 50).then(objects => {
    for (let entry of objects) {
        scene.addObject(entry);
        entry.translate([0, 41.45, 0]);
    }
});

queryObjAsync("/assets/module/cube.obj", 6).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([0, -2.5, 0]);
    }
    scene.addObject(new Barrier([0, 0, 0], [6, -8.5, -12], [6.1, 3.5, 12]));
    scene.addObject(new Barrier([0, 0, 0], [-6.1, -8.5, -12], [-6, 3.5, 12]));
    scene.addObject(new Barrier([0, 0, 0], [-6, -8.5, -12.1], [6, 3.5, -12]));
    scene.addObject(new Barrier([0, 0, 0], [-6, -8.5, 12], [-1.8, 3.5, 12.1]));
    scene.addObject(new Barrier([0, 0, 0], [1.1, -8.5, 12], [6, 3.5, 12.1]));
    scene.addObject(new Barrier([0, 0, 0], [-1.8, 1.4, 12], [1.1, 3.5, 12.1]));
    scene.addObject(new Barrier([0, 0, 0], [-6, -8.6, -12], [6, -8.5, 12]));
    scene.addObject(new Barrier([0, 0, 0], [-6, 3.5, -12], [6, 3.6, 12]));
    console.log("length", cube0.length);
});

//桌子
queryObjAsync("/assets/module/table.obj", 3.2).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-0.85, -8.5, -7.5]);
    }
});

//椅子
queryObjAsync("/assets/module/chair.obj", 4.4).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([-2.2, -8.5, -9.7]);
    }
});

//门
queryColliableObjAsync("/assets/module/door.obj", 0.035).then(entry => {
    scene.addObject(entry);
    entry.translate([1, -8.47, 12]);
    keyController.addListener('o', () => {
        console.log("max", entry.aabb.max);
        console.log("min", entry.aabb.min);
        if (Math.abs(entry.angular) > EPSILON) return;
        if (!door) {
            entry.angular = Math.PI / 2;
            entry.axis = [0, 1, 0];
            entry.angularVelocity = Math.PI;
            entry.angularAcceleration = -Math.PI;
            door = true;
        } else {
            entry.angular = -Math.PI / 2;
            entry.axis = [0, 1, 0];
            entry.angularVelocity = -Math.PI;
            entry.angularAcceleration = Math.PI;
            door = false;
        }
    })
});

//门框
queryObjAsync("/assets/module/doorframe.obj", 0.035).then(cube0 => {
    for (let entry of cube0) {
        scene.addObject(entry);
        entry.translate([1, -8.47, 12]);
    }
});


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
queryColliableObjAsync("/assets/module/smalltable.obj", 3).then(entry => {
    scene.addObject(entry);
    entry.translate([-1.2, -8.5, 5]);
    entry.rotate([0, 1, 0], Math.PI * 0.5);
});

//茶壶
queryColliableObjAsync("/assets/module/teapot.obj", 0.01).then(entry => {
    scene.addObject(entry);
    entry.translate([-1.2, -6.74, 6]);
    entry.rotate([0, 1, 0], Math.PI * 0.5);
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
    }
});

addObjSaver();

// Create engine.
const conf = {
    width: config.WIDTH,
    height: config.HEIGHT
};
const engine = new Engine(scene, canvas, conf);

const keyController = engine.getKeyEventController();
const timeController = engine.getTimeEventController();
const mouseController = engine.getMouseEventController();

keyController.addListener('q', () => engine.stop());
keyController.addListener('e', () => engine.start());
keyController.addListener('w', () => {
    if (!camera.xPosMovable && viewZ[0] > 0) return;
    if (!camera.xNegMovable && viewZ[0] < 0) return;
    if (!camera.yPosMovable && viewZ[1] > 0) return;
    if (!camera.yNegMovable && viewZ[1] < 0) return;
    if (!camera.zPosMovable && viewZ[2] > 0) return;
    if (!camera.zNegMovable && viewZ[2] < 0) return;
    pos[0] += 0.1 * viewZ[0];
    pos[1] += 0.1 * viewZ[1];
    pos[2] += 0.1 * viewZ[2];
    look[0] += 0.1 * viewZ[0];
    look[1] += 0.1 * viewZ[1];
    look[2] += 0.1 * viewZ[2];
    camera.translate([0.1 * viewZ[0], 0.1 * viewZ[1], 0.1 * viewZ[2]]);
    camera.update(0);
    camera.lookAt(look, up);
});
keyController.addListener('s', () => {
    if (!camera.xPosMovable && viewZ[0] < 0) return;
    if (!camera.xNegMovable && viewZ[0] > 0) return;
    if (!camera.yPosMovable && viewZ[1] < 0) return;
    if (!camera.yNegMovable && viewZ[1] > 0) return;
    if (!camera.zPosMovable && viewZ[2] < 0) return;
    if (!camera.zNegMovable && viewZ[2] > 0) return;
    pos[0] -= 0.1 * viewZ[0];
    pos[1] -= 0.1 * viewZ[1];
    pos[2] -= 0.1 * viewZ[2];
    look[0] -= 0.1 * viewZ[0];
    look[1] -= 0.1 * viewZ[1];
    look[2] -= 0.1 * viewZ[2];
    camera.translate([-0.1 * viewZ[0], -0.1 * viewZ[1], -0.1 * viewZ[2]]);
    camera.update(0);
    camera.lookAt(look, up);
});
keyController.addListener('d', () => {
    if (!camera.xPosMovable && viewX[0] < 0) return;
    if (!camera.xNegMovable && viewX[0] > 0) return;
    if (!camera.yPosMovable && viewX[1] < 0) return;
    if (!camera.yNegMovable && viewX[1] > 0) return;
    if (!camera.zPosMovable && viewX[2] < 0) return;
    if (!camera.zNegMovable && viewX[2] > 0) return;
    pos[0] -= 0.1 * viewX[0];
    pos[1] -= 0.1 * viewX[1];
    pos[2] -= 0.1 * viewX[2];
    look[0] -= 0.1 * viewX[0];
    look[1] -= 0.1 * viewX[1];
    look[2] -= 0.1 * viewX[2];
    camera.translate([-0.1 * viewX[0], -0.1 * viewX[1], -0.1 * viewX[2]]);
    camera.update(0);
    camera.lookAt(look, up);
});
keyController.addListener('a', () => {
    if (!camera.xPosMovable && viewX[0] > 0) return;
    if (!camera.xNegMovable && viewX[0] < 0) return;
    if (!camera.yPosMovable && viewX[1] > 0) return;
    if (!camera.yNegMovable && viewX[1] < 0) return;
    if (!camera.zPosMovable && viewX[2] > 0) return;
    if (!camera.zNegMovable && viewX[2] < 0) return;
    pos[0] += 0.1 * viewX[0];
    pos[1] += 0.1 * viewX[1];
    pos[2] += 0.1 * viewX[2];
    look[0] += 0.1 * viewX[0];
    look[1] += 0.1 * viewX[1];
    look[2] += 0.1 * viewX[2];
    camera.translate([0.1 * viewX[0], 0.1 * viewX[1], 0.1 * viewX[2]]);
    camera.update(0);
    camera.lookAt(look, up);
});
keyController.addListener('r', () => {
    viewZ[0] = 0;
    viewZ[1] = 0;
    viewZ[2] = 1;
    up[0] = 0;
    up[1] = 1;
    up[2] = 0;
    look[0] = pos[0];
    look[1] = pos[1];
    look[2] = pos[2] + 1;
    viewX = <Vec3>vec3.cross(viewZ, up);
    viewY = <Vec3>vec3.cross(viewX, viewZ);
    camera.lookAt(look, up);
});
keyController.enable();

mouseController.addListener('move', 'mousemove', (e: MouseEvent) => {
    if (e.clientX - document.getElementById("root").offsetLeft < 0
        || e.clientX - document.getElementById("root").offsetLeft > document.getElementById("root").offsetWidth) return;
    if (e.clientY > document.getElementById("root").offsetHeight) return;

    let x = e.clientX - document.getElementById("root").offsetLeft;
    let y = e.clientY;
    let angularX = (540 - x) / 1080 * Math.PI * 2;
    let angularY = (y - 360) / 720 * Math.PI;
    let move = mat4.identity();
    move = mat4.rotate(move, angularX, [0, 1, 0]);
    move = mat4.rotate(move, angularY, [1, 0, 0]);
    viewZ = <Vec3>vec3.transformMat4([0, 0, 1], move);
    up = <Vec3>vec3.transformMat4([0, 1, 0], move);
    viewX = <Vec3>vec3.transformMat4([1, 0, 0], move);
    viewY = up;
    look[0] = pos[0] + viewZ[0];
    look[1] = pos[1] + viewZ[1];
    look[2] = pos[2] + viewZ[2];
    camera.lookAt(look, up);

});
mouseController.enable();

camera.setEnterListener((c: Collider, info: Vec3) => {

    if (info[0] == 1) camera.xNegMovable = false;
    if (info[0] == -1) camera.xPosMovable = false;
    if (info[1] == 1) camera.yNegMovable = false;
    if (info[1] == -1) camera.yPosMovable = false;
    if (info[2] == 1) camera.zNegMovable = false;
    if (info[2] == -1) camera.zPosMovable = false;

    console.log("collision");
});

camera.setExitListener(() => {
    camera.xPosMovable = true;
    camera.xNegMovable = true;
    camera.yPosMovable = true;
    camera.yNegMovable = true;
    camera.zPosMovable = true;
    camera.zNegMovable = true;
    console.log("collision end");
});
engine.start();

initLightControl(pointLights, directLights);

document.getElementById('screenshot-button').onclick = saveScreenshot;
