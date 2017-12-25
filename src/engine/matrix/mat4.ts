/*
 * created by Zhenyun Yu.
 */

import Matrix, {mat} from './index';


export function zeros(): mat {
    throw Error("not implemented");
}

export function eyes(): mat {
    throw Error("not implemented");
}

export function perspective(fieldOfView: GLfloat,
                            aspect: GLfloat,
                            zNear: GLfloat,
                            zFar: GLfloat): mat {
    const out = new Array(16);
    const f = 1.0 / Math.tan(fieldOfView / 2);
    const nf = 1 / (zNear - zFar);

    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (zFar + zNear) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * zFar * zNear) * nf;
    out[15] = 0;

    return out;
}
