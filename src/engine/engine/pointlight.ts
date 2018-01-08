import Light from './light';
import {Pos, Vec3} from './public';

export default class PointLight extends Light {
    private color: Vec3;
    private ambientCoeff: number

    constructor(pos: Pos,
                color: Vec3,
                ambientCoeff: number,
                turnOn: boolean) {
        super(pos, turnOn);
        this.color = color;
        this.ambientCoeff = ambientCoeff;
    }

    getColor() {
        return this.color;
    }

    getAmbientCoeff() {
        return this.ambientCoeff;
    }

    setColor(color: Vec3) {
        this.color = this.color;
    }

    setAmbientCoeff(ambientCoeff: number) {
        this.ambientCoeff = ambientCoeff;
    }

}