/*
 * created by Zhenyun Yu.
 */

import IncolliableObject from './incolliableobject';
import {Drawable} from "./component";

export default class GeometryObject extends IncolliableObject implements Drawable {
    constructor(pos, vertices) {
        super(pos, undefined);
    }

    draw() {

    }
}
