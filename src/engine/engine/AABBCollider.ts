import {Pos, Vec3} from './public';
import {Collider} from './collider';
import {Colliable, Component} from './component';
import {mat, mat4, vec3} from '../matrix';

export class AABBCollider extends Collider {
    private static allColliders: AABBCollider[] = [];

    private onCollision: AABBCollider[];

    public min: Pos;
    public max: Pos;
    public pos0: Pos;
    public pos1: Pos;
    public pos2: Pos;
    public pos3: Pos;
    public pos4: Pos;
    public pos5: Pos;
    public pos6: Pos;
    public pos7: Pos;
    public object: Colliable;
    private added: boolean;

    constructor(pos: Pos, min: Pos, max: Pos) {
        super(pos);
        this.min = min;
        this.max = max;
        this.pos0 = [min[0], min[1], min[2]];
        this.pos1 = [min[0], min[1], max[2]];
        this.pos2 = [min[0], max[1], min[2]];
        this.pos3 = [min[0], max[1], max[2]];
        this.pos4 = [max[0], min[1], min[2]];
        this.pos5 = [max[0], min[1], max[2]];
        this.pos6 = [max[0], max[1], min[2]];
        this.pos7 = [max[0], max[1], max[2]];
        //AABBCollider.allColliders.push(this)
        this.added = false;
        this.onCollision = [];
    }

    update(time: number, matrix: mat) {
        this.updateBox(matrix);
        for (let x of AABBCollider.allColliders) {
            if (x != this) {
                let index = this.onCollision.indexOf(x);
                let isOnCollision = !(index == -1);
                let isCollision = this.checkCollision(x);
                if (isCollision && !isOnCollision) {
                    this.onCollision.push(x);
                    let info = this.getCollisionInfo(x);
                    this.object.onCollisionEnter(x, info);
                    x.onCollision.push(this);
                    x.object.onCollisionEnter(this, [-info[0], -info[1], -info[2]]);
                }
                if (!isCollision && isOnCollision) {
                    this.onCollision.splice(index, 1);
                    this.object.onCollisionExit(x);
                    index = x.onCollision.indexOf(this);
                    x.onCollision.splice(index, 1);
                    x.object.onCollisionExit(this);
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
        if (minA >= minB && maxA <= maxB) return 0;
        if (minB >= minA && maxB <= maxA) return 0;
        if (minA >= minB && minA <= maxB) return 1;
        if (minB >= minA && minB <= maxA) return -1;
        return 0;
    }

    checkCollision(dst: AABBCollider) {
        return AABBCollider.checkAxis(this.min[0], this.max[0], dst.min[0], dst.max[0])
            && AABBCollider.checkAxis(this.min[1], this.max[1], dst.min[1], dst.max[1])
            && AABBCollider.checkAxis(this.min[2], this.max[2], dst.min[2], dst.max[2])
            && !(this.min[0] > dst.min[0] && this.max[0] < dst.max[0]
                && this.min[1] > dst.min[1] && this.max[1] < dst.max[1]
                && this.min[2] > dst.min[2] && this.max[2] < dst.max[2])
            && !(this.min[0] < dst.min[0] && this.max[0] > dst.max[0]
                && this.min[1] < dst.min[1] && this.max[1] > dst.max[1]
                && this.min[2] < dst.min[2] && this.max[2] > dst.max[2]);
    }

    private static checkAxis(minA: number, maxA: number, minB: number, maxB: number) {
        return !(maxA < minB || minA > maxB);
    }

    updateBox(matrix: mat) {
        //throw new Error("Method not implement.");
        // finished: Use matrix operation to update pos0 to pos7, and use pos0 to pos7 to update min and max
        if (!this.added) {
            AABBCollider.allColliders.push(this);
            this.added = true;
        }
        let tmp0 = vec3.transformMat4(this.pos0, matrix);
        let tmp1 = vec3.transformMat4(this.pos1, matrix);
        let tmp2 = vec3.transformMat4(this.pos2, matrix);
        let tmp3 = vec3.transformMat4(this.pos3, matrix);
        let tmp4 = vec3.transformMat4(this.pos4, matrix);
        let tmp5 = vec3.transformMat4(this.pos5, matrix);
        let tmp6 = vec3.transformMat4(this.pos6, matrix);
        let tmp7 = vec3.transformMat4(this.pos7, matrix);
        this.min[0] = Math.min(tmp0[0], tmp1[0], tmp2[0], tmp3[0], tmp4[0], tmp5[0], tmp6[0], tmp7[0]);
        this.min[1] = Math.min(tmp0[1], tmp1[1], tmp2[1], tmp3[1], tmp4[1], tmp5[1], tmp6[1], tmp7[1]);
        this.min[2] = Math.min(tmp0[2], tmp1[2], tmp2[2], tmp3[2], tmp4[2], tmp5[2], tmp6[2], tmp7[2]);
        this.max[0] = Math.max(tmp0[0], tmp1[0], tmp2[0], tmp3[0], tmp4[0], tmp5[0], tmp6[0], tmp7[0]);
        this.max[1] = Math.max(tmp0[1], tmp1[1], tmp2[1], tmp3[1], tmp4[1], tmp5[1], tmp6[1], tmp7[1]);
        this.max[2] = Math.max(tmp0[2], tmp1[2], tmp2[2], tmp3[2], tmp4[2], tmp5[2], tmp6[2], tmp7[2]);
    }
}
