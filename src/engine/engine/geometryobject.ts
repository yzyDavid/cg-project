/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from "./component";
import {Pos} from "./public";

export default class GeometryObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected elements: number[];
    protected colors: number[];

    constructor(pos, vertices) {
        super(pos, undefined);
        this.vertices = vertices;
    }

    draw() {

    }
}
