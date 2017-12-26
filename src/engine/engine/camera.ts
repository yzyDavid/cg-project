/*
 * created by Zhenyun Yu.
 */

import {Component} from "./component";
import {Pos} from './public';
import {mat, mat4} from '../matrix';

export default class Camera extends Component {
    private fieldOfView: number;
    private aspect: number;
    private near: number;
    private far: number;
    private lookDirection: Pos;

    constructor(pos: Pos, fieldOfView: number, aspect: number, near: number, far: number) {
        super(pos);
        this.fieldOfView = fieldOfView;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    getPerspectiveMatrix(): mat {
        return mat4.perspective(this.fieldOfView, this.aspect, this.near, this.far);
    }

    attachTo(component: Component) {
    }

    lookAt(pos: Pos) {
        this.lookDirection = pos;
    }
}
