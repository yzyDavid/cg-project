/*
 * created by Zhenyun Yu.
 */


import {Drawable, Incolliable, Model} from './component';

export default class IncolliableObject extends Incolliable implements Drawable {
    _model: Model;

    constructor(pos, model) {
        super(pos);
        this._model = model;
    }

    draw() {
    }
}
