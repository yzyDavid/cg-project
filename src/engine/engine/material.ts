import {Vec3} from "./public";

export default class Material {
    private ambientColor: Vec3;
    private diffuseColor: Vec3;
    private specularColor: Vec3;
    private shininess: number;

    constructor(ambientColor: Vec3,
                diffuseColor: Vec3,
                specularColor: Vec3,
                shininess: number) {
        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        this.specularColor = specularColor;
        this.shininess = shininess;
    }

    getAmbientColor(): Vec3 {
        return this.ambientColor;
    }

    getDiffuseColor(): Vec3 {
        return this.diffuseColor;
    }

    getSpecularColor(): Vec3 {
        return this.specularColor;
    }

    getShininess(): number {
        return this.shininess;
    }
}