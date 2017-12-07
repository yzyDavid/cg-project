/*
 * created by Zhenyun Yu.
 */

import {HEIGHT, WIDTH} from "./config";

export const horizAspect = HEIGHT / WIDTH;

export function initBuffers(gl) {
    const squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    const vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
    ];

    // TODO: why not referred squareVerticesBuffer object?
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

export function drawScene(gl) {
    
}