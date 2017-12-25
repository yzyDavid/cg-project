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

    constructor(pos: Pos, fieldOFView: number, aspect: number, near: number, far: number) {
        super(pos);
        this.fieldOfView = fieldOFView;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    getPerspectiveMatrix(): mat {
        return mat4.perspective(this.fieldOfView, this.aspect, this.near, this.far);
    }

    attachTo(component: Component) {
    }
}
