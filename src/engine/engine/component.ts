/*
 * created by Zhenyun Yu.
 */

import {Pos} from "./public";

/**
 * Drawable or interactive with the scene Object
 *
 * @class
 *
 */
export class Component {
    _position: Pos;

    constructor(position: Pos) {
        this._position = position;
    }
}

export interface Drawable {
    draw(): void;
}

export class Model {

}

export class Colliable extends Component {
    constructor(position) {
        super(position);
    }
}

export class Incolliable extends Component {
    constructor(position) {
        super(position);
    }
}

export class Barrier extends Colliable {
}

export abstract class BoxObject extends Colliable implements Drawable {
    abstract draw(): void
}