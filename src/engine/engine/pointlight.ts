import Light from './light';
import {Pos, Vec3} from './public';

export default class PointLight extends Light {
    constructor(pos: Pos,
                color: Vec3,
                ambientCoeff: number,
                turnOn: boolean) {
        super(pos, color, ambientCoeff, turnOn);
    }
}