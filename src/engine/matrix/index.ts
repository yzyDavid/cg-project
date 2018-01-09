/*
 * created by Zhenyun Yu.
 */

/*
 * column majored matrices are used in WebGL.
 * so the library here use column major, too.
 */

export default interface Matrix {
}

export type mat = number[];
export type vec = number[];

export const EPSILON = 0.000001;

import * as mat4 from './mat4';
import * as vec3 from './vec3';

export {
    mat4,
    vec3
};