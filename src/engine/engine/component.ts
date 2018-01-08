/*
 * created by Zhenyun Yu.
 */

import {Pos, Vec3} from './public';
import {mat, default as Matrix} from '../matrix';
import Shader from './shader';
import Scene from './scene';
import Engine from './engine';
import {AABBCollider} from "./AABBCollider";
import {Collider} from "./Collider";
import {mat4} from "../matrix";
import {multiply} from "../matrix/mat4";

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
    //protected velocity: Vec3;
    protected shaderName: string;

    protected _linearVelocity: Vec3;
    protected _linearAcceleration: Vec3;
    protected _axis: Vec3;
    protected _angularVelocity: number;
    protected _angularAcceleration: number;
    protected moved: boolean;

    protected modelMatrix: mat;

    constructor(position: Pos) {
        this.position = position;
        this.children = [];
        this.radius = 0.0;
        //this.velocity = [0.0, 0.0, 0.0];
        this.linearVelocity = [0.0, 0.0, 0.0];
        this.linearAcceleration = [0.0, 0.0, 0.0];
        this.axis = [0.0, 0.0, 0.0];
        this.angularVelocity = 0.0;
        this.angularAcceleration = 0.0;
        this.modelMatrix = mat4.identity();
        this.moved = false;
        this.shaderName = '';
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

    shaderAssigned(): boolean {
        return this.shaderName !== '';
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

    update(time: number, matrix: mat = mat4.identity()) {
        // TODO: Use all the physical quantities to update the model matrix
        this.linearVelocity[0] += this.linearAcceleration[0] * time;
        this.linearVelocity[1] += this.linearAcceleration[1] * time;
        this.linearVelocity[2] += this.linearAcceleration[2] * time;
        this.axis[0] += this.linearVelocity[0] * time;
        this.axis[1] += this.linearVelocity[1] * time;
        this.axis[2] += this.linearVelocity[2] * time;
        this.angularVelocity += this.angularAcceleration * time;
        this.moved = !!(this.linearVelocity[0] || this.linearVelocity[1] || this.linearVelocity[2] || this.angularVelocity);
        let move = mat4.identity();
        // TODO: Add rotation
        mat4.translate(move, move, [this.linearVelocity[0] * time, this.linearVelocity[1] * time, this.linearVelocity[2] * time]);
        // TODO: Update position, using position * move
        this.modelMatrix = mat4.multiply(move, this.modelMatrix);
    }

    updateChildren(time: number, matrix: mat = mat4.identity()) {
        matrix = mat4.multiply(this.modelMatrix, matrix);
        this.forEach((obj) => {
            if ('draw' in obj) {
                obj.update(time, matrix);
            }
            obj.updateChildren(time, matrix);
        })
    }

    get linearVelocity(): Vec3 {
        return this._linearVelocity;
    }

    set linearVelocity(val: Vec3) {
        this._linearVelocity = val;
    }

    get linearAcceleration(): Vec3 {
        return this._linearAcceleration;
    }

    set linearAcceleration(val: Vec3) {
        this._linearAcceleration = val;
    }

    get axis(): Vec3 {
        return this._axis;
    }

    set axis(val: Vec3) {
        this._axis = val;
    }

    get angularVelocity(): number {
        return this._angularVelocity;
    }

    set angularVelocity(val: number) {
        this._angularVelocity = val;
    }

    get angularAcceleration(): number {
        return this._angularAcceleration;
    }

    set angularAcceleration(val: number) {
        this._angularAcceleration = val;
    }

    getPosition() {
        return this.position;
    }

    setPosition(pos: Pos) {
        this.position = pos;
    }

    setShader(shader: string) {
        // TODO: judge shader name valid here.
        this.shaderName = shader;
    }

    getShader(): string {
        return this.shaderName;
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

export abstract class Colliable extends Component {
    protected aabb: AABBCollider;

    constructor(position: Pos, min?: Pos, max?: Pos) {
        super(position);
        if (!min) {
            this.aabb = new AABBCollider(position, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]);
        } else {
            this.aabb = new AABBCollider(position, min, max);
        }
    }

    update(time: number, matrix: mat = mat4.identity()) {
        super.update(time);
        if (this.moved) {
            this.aabb.linearVelocity = this.linearVelocity;
            this.aabb.angularVelocity = this.angularVelocity;
            this.aabb.update(time, matrix);
        }
    }

    private revoke() {
        // TODO: revoke the update operation
        this.linearVelocity = [0.0, 0.0, 0.0];
        this.linearAcceleration = [0.0, 0.0, 0.0];
        this.axis = [0.0, 0.0, 0.0];
        this.angularVelocity = 0.0;
        this.angularAcceleration = 0.0;
        this.moved = false;
    }

    onCollisionEnter(collider: Collider, info: Vec3) {
        this.revoke()
    }

    onCollisionExit(collider: Collider) {

    }
}

export abstract class Incolliable extends Component {
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