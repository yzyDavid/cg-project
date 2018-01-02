import {Pos} from "./public";
import {Collider} from "./Collider";

export class AABBCollider extends Collider {
    private static allColliders: AABBCollider[];

    private onCollision: AABBCollider[];

    public min: Pos;
    public max: Pos;

    constructor(min: Pos, max: Pos) {
        super();
        this.min = min;
        this.max = max;
        AABBCollider.allColliders.push(this)
    }

    // TODO: Should support rotate later
    update() {
        throw new Error("Method not implement.");
    }
}
