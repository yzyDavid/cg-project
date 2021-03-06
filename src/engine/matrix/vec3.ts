/*
 * created by Zhenyun Yu.
 *
 * some algorithms here are from gl-matrix library, GotHub links is followed:
 * https://github.com/toji/gl-matrix
 */

import {mat, vec, EPSILON} from './index';
import {Vec3} from "../";

/**
 * Transform with a mat4
 * means multiply with it, matrix on left side.
 *
 * @param {Vec3} a
 * @param {Mat4} m
 * @returns {Vec3}
 */
export function transformMat4(a: vec, m: mat): vec {
    const out = new Array(3);

    let x = a[0], y = a[1], z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} a vector to normalize
 * @returns {vec3}
 */
export function normalize(a: vec): vec {
    const out = new Array(3);
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3}
 */
export function cross(a: vec, b: vec): vec {
    const out = new Array(3);
    let ax = a[0], ay = a[1], az = a[2];
    let bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}