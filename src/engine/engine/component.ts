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
    abstract draw(modelMatrix?: mat): void
}