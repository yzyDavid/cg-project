/*
 * created by Zhenyun Yu.
 */

import {Component} from "./component";
import {Pos} from './public';

export default class Camera extends Component {
    private fieldOfView: number;

    constructor(pos: Pos) {
        super(pos)
    }

    attachTo(component: Component) {
    }
}
