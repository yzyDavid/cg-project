import {Drawable, Colliable} from './component';
import {Pos, Vec3} from './public';
import {Collider} from "./collider";

export default class ColliableObject extends Colliable {
    private enterCallback: () => void;
    private exitCallback: () => void;

    constructor(pos: Pos, min: Pos, max: Pos) {
        super(pos, min, max);
        this.enterCallback = () => {
            console.log("collision");
        }
        this.exitCallback = () => {
            console.log("collision end");
        }
    }

    onCollisionEnter(collider: Collider, info: Vec3) {
        this.enterCallback();
    }

    onCollisionExit(collider: Collider) {
        this.exitCallback();
    }

    setEnterListener(action: () => void) {
        this.enterCallback = action;
    }

    setExitListener(action: () => void) {
        this.exitCallback = action;
    }
}