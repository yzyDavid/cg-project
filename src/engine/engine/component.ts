/*
 * created by Zhenyun Yu.
 */

import {Pos, Vec3} from './public';
import {mat, default as Matrix} from '../matrix';
import Shader from './shader';
import Scene from './scene';
import Engine from './engine';
import {AABBCollider} from './AABBCollider';
import {Collider} from './collider';
import {mat4, vec3} from '../matrix';

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
        let move = mat4.identity();
        mat4.translate(move, move, position);
        this.modelMatrix = vec3.transformMat4(this.position, move);
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
    drawChildren(gl: WebGLRenderingContext, engine?: Engine, modelMatrix: mat = mat4.identity()): void {
        modelMatrix = mat4.multiply(this.modelMatrix, modelMatrix);
        this.forEach((obj) => {
            if ('draw' in obj) {
                const d = <Drawable>(obj as any);
                d.draw(gl, engine, modelMatrix);
            }
            obj.drawChildren(gl, engine, modelMatrix);
        });
    }

    // Here matrix is used only for colliable object to update its AABB box
    update(time: number, matrix: mat = mat4.identity()) {
        // TODO: Use all the physical quantities to update the model matrix
        this.linearVelocity[0] += this.linearAcceleration[0] * time;
        this.linearVelocity[1] += this.linearAcceleration[1] * time;
        this.linearVelocity[2] += this.linearAcceleration[2] * time;
        this.angularVelocity += this.angularAcceleration * time;
        this.moved = !!(this.linearVelocity[0] || this.linearVelocity[1] || this.linearVelocity[2] || this.angularVelocity);
        let move = mat4.identity();
        // finished: Add rotation
        mat4.rotate(move, this.angularVelocity * time, this.axis);
        mat4.translate(move, move, [this.linearVelocity[0] * time, this.linearVelocity[1] * time, this.linearVelocity[2] * time]);
        // finished: Update position, using position * move
        this.position = <Pos>vec3.transformMat4(this.position, move);
        this.modelMatrix = mat4.multiply(this.modelMatrix, move);
    }

    // matrix is the product of the model matrix of the parent components
    updateChildren(time: number, matrix: mat = mat4.identity()) {
        matrix = mat4.multiply(this.modelMatrix, matrix);
        this.forEach((obj) => {
            if ('draw' in obj) {
                obj.update(time, matrix);
            }
            obj.updateChildren(time, matrix);
        })
    }

    // Would better be used only in initialize
    /**
     * Update position with translation when initialize
     *
     * @param {Vec3} move movement
     */
    translate(move: Vec3) {
        // finished: Update position
        let tmp = mat4.identity();
        mat4.translate(tmp, tmp, move);
        this.position = <Pos>vec3.transformMat4(this.position, tmp);
        this.modelMatrix = mat4.multiply(this.modelMatrix, tmp);
    }

    /**
     * Update position with rotation when initialize
     *
     * @param {Vec3} axis
     * @param {number} angular
     */
    rotate(axis: Vec3, angular: number) {
        // finished: Update position
        // finished: Add rotation
        let tmp = mat4.rotate(mat4.identity(), angular, axis);
        this.position = <Pos>vec3.transformMat4(this.position, tmp);
        this.modelMatrix = mat4.multiply(this.modelMatrix, tmp);
    }

    // Use getter and setter to modify the physical quantities
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
        this.aabb.object = this;
    }

    update(time: number, matrix: mat = mat4.identity()) {
        super.update(time, matrix);
        if (this.moved) {
            this.aabb.update(time, mat4.multiply(this.modelMatrix, matrix));
        }
    }

    translate(move: Vec3) {
        super.translate(move);
        // Here we simply do not consider about collision, since it is initializing
        this.aabb.updateBox(this.modelMatrix);
    }

    rotate(axis: Vec3, angular: number) {
        super.rotate(axis, angular);
        this.aabb.updateBox(this.modelMatrix);
    }

    private revoke(time: number) {
        // TODO: revoke the update operation
        let tmp = mat4.identity();
        mat4.translate(tmp, tmp, [this.linearVelocity[0] * time, this.linearVelocity[1] * time, this.linearVelocity[2] * time]);
        mat4.invert(tmp, tmp);
        let remove = tmp;
        tmp = mat4.rotate(mat4.identity(), this.angularVelocity * time, this.axis);
        mat4.invert(tmp, tmp);
        remove = mat4.multiply(remove, tmp);
        this.position = <Pos>vec3.transformMat4(this.position, remove);
        this.modelMatrix = mat4.multiply(this.modelMatrix, remove);
        this.aabb.updateBox(this.modelMatrix);
        this.linearVelocity = [0.0, 0.0, 0.0];
        this.linearAcceleration = [0.0, 0.0, 0.0];
        this.axis = [0.0, 0.0, 0.0];
        this.angularVelocity = 0.0;
        this.angularAcceleration = 0.0;
        this.moved = false;
    }

    onCollisionEnter(collider: Collider, info: Vec3, time: number) {
        this.revoke(time)
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