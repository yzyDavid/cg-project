import {Vec3} from "./public";

export default class Material {
    constructor (public readonly ambientColor: Vec3,
                 public readonly diffuseColor: Vec3,
                 public readonly specularColor: Vec3,
                 public readonly shininess: number
    ) {}
}