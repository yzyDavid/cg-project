/*
 * created by Zhenyun Yu.
 */

import Matrix from './matrix';

export default class mat4 implements Matrix {
    _data: number[];

    constructor() {
    }

    static zeros(): mat4 {
        throw Error("not implemented");
    }

    static eye(): mat4 {
        throw Error("not implemented");
    }

    static perspective(fieldOfView: GLfloat,
                       aspect: GLfloat,
                       zNear: GLfloat,
                       zFar: GLfloat): mat4 {
        throw Error("not implemented");
    }
}
