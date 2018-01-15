import {Pos, Vec3} from "./public";
import Light from "./light";

export default class DirectLight extends Light {
    private direction: Vec3;

    constructor(direction: Vec3,
                color: Vec3,
                ambientCoeff: number,
                turnOn: boolean) {
        super([0, 0, 0], color, ambientCoeff, turnOn);  // Useless.
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }

    setDirection(direction: Vec3) {
        this.direction = direction;
    }
}