/*
 * created by Zhenyun Yu.
 */

import {Component} from './component';
import {Pos} from './public';

export default abstract class Light extends Component {
    private on: boolean;

    constructor(pos: Pos) {
        super(pos);
    }

    isOn(): boolean {
        return this.on;
    }

    turnOn() {
        this.on = true;
    }

    turnOff() {
        this.on = false;
    }
}
