import {Pos, Vec3} from "./public";
import Light from "./light";

export default class DirectLight extends Light {
    constructor(private direction: Vec3,
                private ambient: Vec3,
                private diffuse: Vec3,
                private specular: Vec3) {
        super([0, 0, 0]);  // Useless position.
    }

    getDirection() {
        return this.direction;
    }

    getAmbient() {
        return this.ambient;
    }

    getDiffuse() {
        return this.diffuse;
    }

    getSpecular() {
        return this.specular;
    }

    setDirection(direction: Vec3) {
        this.direction = direction;
    }

    setAmbient(ambient: Vec3) {
        this.ambient = ambient;
    }

    setDiffuse(diffuse: Vec3) {
        this.diffuse = diffuse;
    }

    setSpecular(specular: Vec3) {
        this.specular = specular;
    }
}