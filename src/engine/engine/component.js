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
    constructor(position) {
        this._position = position;
    }
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