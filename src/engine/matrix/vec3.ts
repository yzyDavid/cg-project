/*
 * created by Zhenyun Yu.
 *
 * some algorithms here are from gl-matrix library, GotHub links is followed:
 * https://github.com/toji/gl-matrix
 */

import {mat, vec, EPSILON} from './index';

/*
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
