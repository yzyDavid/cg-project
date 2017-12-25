/*
 * created by Zhenyun Yu.
 */

import {Pos} from './public';
import {mat} from '../matrix';

/**
 * Drawable or interactive with the scene Object
 *
 * @class
 *
 */
export class Component {
    protected position: Pos;

    constructor(position: Pos) {
        this.position = position;
    }
}

export interface Drawable {
    draw(modelMatrix?: mat): void;
}

// TODO: maybe removed.
export class Model {
}

export class Colliable extends Component {
    constructor(position: Pos) {
        super(position);
    }
}

export class Incolliable extends Component {
    constructor(position: Pos) {
        super(position);
    }
}

// invisible but colliable
export class Barrier extends Colliable {
}

// visible and colliable
export abstract class BoxObject extends Colliable implements Drawable {
    abstract draw(modelMatrix?: mat): void
}