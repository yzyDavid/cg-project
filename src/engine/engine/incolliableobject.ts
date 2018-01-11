/*
 * created by Zhenyun Yu.
 */


import {Drawable, Incolliable, Model} from './component';
import {Pos} from './public';
import Shader from './shader';
import Scene from "./scene";
import {mat} from '../matrix';
import Engine from './engine';

// visible and incolliable.
export default abstract class IncolliableObject extends Incolliable implements Drawable {
    draw(gl: WebGLRenderingContext, engine: Engine, modelMatrix?: mat): void {
        throw new Error("Method not implemented.");
    }

    private model: Model;

    constructor(pos: Pos, model: Model) {
        super(pos);
        this.model = model;
    }
}
