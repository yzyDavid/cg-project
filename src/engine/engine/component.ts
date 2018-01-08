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
    protected _rotateAxis: Vec3;
    protected _rotateAngularVelocity: number;
    protected _rotateAngularAcceleration: number;
    protected _revolutionAxis: Vec3;
    protected _revolutionAngularVelocity: number;
    protected _revolutionAngularAcceleration: number;

    protected modelMatrix: Matrix;

    constructor(position: Pos) {
        this.position = position;
        this.children = [];
        this.radius = 0.0;
        //this.velocity = [0.0, 0.0, 0.0];
        this.linearVelocity = [0.0, 0.0, 0.0];
        this.linearAcceleration = [0.0, 0.0, 0.0];
        this.rotateAxis = [0.0, 0.0, 0.0];
        this.rotateAngularVelocity = 0.0;
        this.rotateAngularAcceleration = 0.0;
        this.revolutionAxis = [0.0, 0.0, 0.0];
        this.revolutionAngularVelocity = 0.0;
        this.revolutionAngularAcceleration = 0.0;
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

    update() {
        // TODO: Use all the physical quantities to update the model matrix
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

    get rotateAxis(): Vec3 {
        return this._rotateAxis;
    }

    set rotateAxis(val: Vec3) {
        this._rotateAxis = val;
    }

    get rotateAngularVelocity(): number {
        return this._rotateAngularVelocity;
    }

    set rotateAngularVelocity(val: number) {
        this._rotateAngularVelocity = val;
    }

    get rotateAngularAcceleration(): number {
        return this._rotateAngularAcceleration;
    }

    set rotateAngularAcceleration(val: number) {
        this._rotateAngularAcceleration = val;
    }

    get revolutionAxis(): Vec3 {
        return this._revolutionAxis;
    }

    set revolutionAxis(val: Vec3) {
        this._revolutionAxis = val;
    }

    get revolutionAngularVelocity(): number {
        return this._revolutionAngularVelocity;
    }

    set revolutionAngularVelocity(val: number) {
        this._revolutionAngularVelocity = val;
    }

    get revolutionAngularAcceleration(): number {
        return this._revolutionAngularAcceleration;
    }

    set revolutionAngularAcceleration(val: number) {
        this._revolutionAngularAcceleration = val;
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
    }

    update() {
        super.update();

    }

    abstract onCollisionEnter(collider: Collider, info: Vec3): void;

    abstract onCollisionExit(collider: Collider): void;
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

    onCollisionEnter(collider: Collider, info: Vec3) {

    }

    onCollisionExit(collider: Collider) {

    }
}

// visible and colliable
export abstract class BoxObject extends Colliable implements Drawable {
    abstract draw(gl: WebGLRenderingContext, engine: Engine, modelMatrix?: mat): void;
}