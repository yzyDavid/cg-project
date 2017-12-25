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

import * as mat4 from './mat4';

export {
    mat4
};