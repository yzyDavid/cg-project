import {Pos, Vec3} from "./public";
import {Collider} from "./Collider";
import {Colliable, Component} from "./component";

export class AABBCollider extends Collider {
    private static allColliders: AABBCollider[];

    private onCollision: AABBCollider[];

    public min: Pos;
    public max: Pos;
    public object: Colliable;

    constructor(pos: Pos, min: Pos, max: Pos) {
        super(pos);
        this.min = min;
        this.max = max;
        AABBCollider.allColliders.push(this)
    }

    update() {
        for (let x of AABBCollider.allColliders) {
            if (x != this) {
                let index = this.onCollision.indexOf(x);
                let isOnCollision = !(index == -1);
                let isCollision = this.checkCollision(x);
                if (isCollision && !isOnCollision) {
                    this.onCollision.push(x);
                    let info = this.getCollisionInfo(x);
                    this.object.onCollisionEnter(x, info);
                }
                if (!isCollision && isOnCollision) {
                    this.onCollision.splice(index, 1);
                    this.object.onCollisionExit(x);
                }
            }
        }
    }

    getCollisionInfo(dst: AABBCollider): Vec3 {
        return [AABBCollider.getAxisInfo(this.min[0], this.max[0], dst.min[0], dst.max[0]),
            AABBCollider.getAxisInfo(this.min[1], this.max[1], dst.min[1], dst.max[1]),
            AABBCollider.getAxisInfo(this.min[2], this.max[2], dst.min[2], dst.max[2])];
    }

    private static getAxisInfo(minA: number, maxA: number, minB: number, maxB: number) {
        if (minA >= minB && minA <= maxB) return 1;
        if (minB >= minA && minB <= maxA) return -1;
        return 0;
    }

    checkCollision(dst: AABBCollider) {
        return AABBCollider.checkAxis(this.min[0], this.max[0], dst.min[0], dst.max[0])
            && AABBCollider.checkAxis(this.min[1], this.max[1], dst.min[1], dst.max[1])
            && AABBCollider.checkAxis(this.min[2], this.max[2], dst.min[2], dst.max[2]);
    }

    private static checkAxis(minA: number, maxA: number, minB: number, maxB: number) {
        return !(maxA < minB || minA > maxB);
    }

    change() {
        throw new Error("Method not implement.");
    }
}
