import {Pos, Vec3} from "./public";
import Light from "./light";

export default class DirectLight extends Light {
    private direction: Vec3;
    private color: Vec3;
    private ambientCoeff: number

    constructor(direction: Vec3,
                color: Vec3,
                ambientCoeff: number,
                turnOn: boolean) {
        super([0, 0, 0], turnOn);  // Useless.
        this.direction = direction;
        this.color = color;
        this.ambientCoeff = ambientCoeff;
    }

    getDirection() {
        return this.direction;
    }

    getColor() {
        return this.color;
    }

    getAmbientCoeff() {
        return this.ambientCoeff;
    }

    setDirection(direction: Vec3) {
        this.direction = direction;
    }

    setColor(color: Vec3) {
        this.color = this.color;
    }

    setAmbientCoeff(ambientCoeff: number) {
        this.ambientCoeff = ambientCoeff;
    }
}