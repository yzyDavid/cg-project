/*
 * created by Zhenyun Yu.
 */

import {Component} from "./component";
import {Pos, Vec3} from './public';

export default abstract class Light extends Component {
    private on: boolean;
    private color: Vec3;
    private ambientCoeff: number

    constructor(pos: Pos,
                color: Vec3,
                ambientCoeff: number,
                turnOn: boolean) {
        super(pos);
        this.color = color;
        this.ambientCoeff = ambientCoeff;
        this.on = turnOn;
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

    getColor() {
        return this.color;
    }

    getAmbientCoeff() {
        return this.ambientCoeff;
    }

    setColor(color: Vec3) {
        this.color = color;
    }

    setAmbientCoeff(ambientCoeff: number) {
        this.ambientCoeff = ambientCoeff;
    }
}
