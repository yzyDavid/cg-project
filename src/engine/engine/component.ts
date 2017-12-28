/*
 * created by Zhenyun Yu.
 */

import {Pos, Vec3} from './public';
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
    protected radius: number;
    protected velocity: Vec3;

    constructor(position: Pos) {
        this.position = position;
        this.children = [];
        this.radius = 0.0;
        this.velocity = [0.0, 0.0, 0.0];
    }

    forEach(func: (o: Component, index?: number, array?: Component[]) => void): void {
        this.children.forEach(func);
    }

    addChild(o: Component): void {
        this.children.push(o);
    }

    removeChild(o: Component) {
        const index = this.children.indexOf(o);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    // internal use only.
    getChildren() {
        return this.children;
    }

    setRadius(r: number) {
        this.radius = r;
    }

    getRadius() {
        return this.radius;
    }

    // may be designed not properly.
    drawChildren(gl: WebGLRenderingContext, engine?: Engine, modelMatrix?: mat): void {
        this.forEach((obj) => {
            if ('draw' in obj) {
                const d = <Drawable>(obj as any);
                d.draw(gl, engine, modelMatrix);
            }
            obj.drawChildren(gl, engine, modelMatrix);
        });
    }

    update() {
        // TODO
    }

    getPosition() {
        return this.position;
    }

    setPosition(pos: Pos) {
        this.position = pos;
    }
}

export interface Drawable {
    draw(gl: WebGLRenderingContext, engine: Engine, modelMatrix?: mat): void;
}

export interface EnumerableChildren<T> {
    forEach(func: (o: T, index?: number, array?: T[]) => void): void;
}

export interface ChildrenDrawable {
    drawChildren(gl: WebGLRenderingContext, engine?: Engine, modelMatrix?: mat): void;
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
    constructor(position: Pos) {
        super(position);
    }
}

// visible and colliable
export abstract class BoxObject extends Colliable implements Drawable {
    abstract draw(gl: WebGLRenderingContext, engine: Engine, modelMatrix?: mat): void;
}