/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from "./component";
import {Pos} from "./public";

export default class GeometryObject extends IncolliableObject implements Drawable {
    _vertices: Pos[];

    constructor(pos, vertices) {
        super(pos, undefined);
        this._vertices = vertices;
    }

    draw() {

    }
}
