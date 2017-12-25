/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from "./component";
import {Pos} from "./public";

export default class GeometryObject extends IncolliableObject implements Drawable {
    protected vertices: number[];
    protected indices: number[];
    protected colors: number[];

    constructor(pos: Pos,
                vertices: number[],
                indices: number[],
                colors: number[]) {
        super(pos, undefined);
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
    }

    draw() {
    }
}
