/*
 * created by Zhenyun Yu.
 */


import {Incolliable, Model} from './component';

export default class IncolliableObject extends Incolliable {
    _model: Model;

    constructor(pos, model) {
        super(pos);
        this._model = model;
    }

    draw() {
    }
}
