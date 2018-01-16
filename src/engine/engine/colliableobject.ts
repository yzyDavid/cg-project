import {Drawable, Colliable} from './component';
import {Pos, Vec3} from './public';
import {Collider} from "./collider";
import {AABBCollider} from "./AABBCollider";

export default class ColliableObject extends Colliable {
    protected enterCallback: (c: Collider, info: Vec3) => void;
    protected exitCallback: (c: Collider) => void;

    constructor(pos: Pos, min: Pos, max: Pos) {
        super(pos, min, max);
        this.enterCallback = () => {
            console.log("collision");
        };
        this.exitCallback = () => {
            console.log("collision end");
        };
    }

    onCollisionEnter(collider: AABBCollider, info: Vec3) {
        this.enterCallback(collider, info);
    }

    onCollisionExit(collider: AABBCollider) {
        this.exitCallback(collider);
    }

    setEnterListener(action: (c: Collider, info: Vec3) => void) {
        this.enterCallback = action;
    }

    setExitListener(action: () => void) {
        this.exitCallback = action;
    }
}