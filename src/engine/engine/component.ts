/*
 * created by Zhenyun Yu.
 */

import {Pos} from './public';
import {mat} from '../matrix';
import Shader from './shader';
import Scene from './scene';
import Engine from './engine';

/**
 * Drawable or interactive with the scene Object
 *
 * @class
 *
 */
export class Component implements EnumerableChildren<Component>, ChildrenDrawable {
    protected position: Pos;
    protected children: Component[];

    constructor(position: Pos) {
        this.position = position;
        this.children = [];
    }

    forEach(func: (o: Component, index?: number, array?: Component[]) => void): void {
        this.children.forEach(func);
    }

    addChild(o: Component): void {
        this.children.push(o);
    }

    removeChild(o: Component) {
        throw new Error();
    }

    // may be designed not properly.
    drawChildren(gl: WebGLRenderingContext, engine?: Engine, modelViewMatrix?: mat) {
        this.forEach((obj) => {
            if ('draw' in obj) {
                const d = <Drawable>(obj as any);
                d.draw(gl, engine);
            }
        });
    }
}

export interface Drawable {
    draw(gl: WebGLRenderingContext, engine?: Engine, modelViewMatrix?: mat): void;
}

export interface EnumerableChildren<T> {
    forEach(func: (o: T, index?: number, array?: T[]) => void): void;
}

export interface ChildrenDrawable {
    drawChildren(gl: WebGLRenderingContext, engine?: Engine, modelViewMatrix?: mat): void;
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
    abstract draw(gl: WebGLRenderingContext, engine?: Engine, modelViewMatrix?: mat): void;
}