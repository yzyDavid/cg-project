/*
 * created by Zhenyun Yu.
 */


import {Drawable, Incolliable, Model} from './component';
import {Pos} from './public';

export default class IncolliableObject extends Incolliable implements Drawable {
    _model: Model;

    constructor(pos: Pos, model: Model) {
        super(pos);
        this._model = model;
    }

    draw() {
    }
}
