/*
 * created by Zhenyun Yu.
 */

import {Component} from "./component";
import {Pos, Vec3} from './public';

export default class Light extends Component {
    private color: Vec3;
    private ambientCoeff: number;
    private on: boolean;

    constructor(pos: Pos, color: Vec3, ambientCoeff: number, turnOn: boolean) {
        super(pos);
        this.color = color;
        this.ambientCoeff = ambientCoeff;
        this.on = turnOn;
    }

    getColor(): Vec3 {
        return this.color;
    }

    getAmbientCoeff(): number {
        return this.ambientCoeff;
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
