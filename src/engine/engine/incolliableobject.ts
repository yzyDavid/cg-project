/*
 * created by Zhenyun Yu.
 */


import {Drawable, Incolliable, Model} from './component';
import {Pos} from './public';
import Shader from './shader';
import Scene from "./scene";
import {mat} from "../matrix";

// visible and incolliable.
export default abstract class IncolliableObject extends Incolliable implements Drawable {
    draw(gl: WebGLRenderingContext, shader: Shader, scene: Scene, program: WebGLProgram, modelMatrix?: mat): void {
        throw new Error("Method not implemented.");
    }

    private model: Model;

    constructor(pos: Pos, model: Model) {
        super(pos);
        this.model = model;
    }
}
