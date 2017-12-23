/*
 * created by Zhenyun Yu.
 */


import {Component} from "./component";

export default class GameObject extends Component {
    constructor(pos, model) {
        super(pos);
        this._model = model;
    }
}
