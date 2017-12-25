/*
 * created by Zhenyun Yu.
 */

/**
 * Drawable or interactive with the scene Object
 *
 * @class
 *
 */
export class Component {
    _position: [number, number, number];

    constructor(position) {
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

export class BoxObject extends Colliable {
}