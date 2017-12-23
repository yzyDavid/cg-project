/*
 * created by Zhenyun Yu.
 */


import {Incolliable} from "./component";

export default class IncolliableObject extends Incolliable {
    constructor(pos, model) {
        super(pos);
        this._model = model;
    }

    draw() {}
}
