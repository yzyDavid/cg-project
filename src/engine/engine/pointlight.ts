import Light from "./light";
import {Pos, Vec3} from "./public";

export default class PointLight extends Light {
    constructor(pos: Pos,
                private ambient: Vec3,
                private diffuse: Vec3,
                private specular: Vec3) {
        super(pos);
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