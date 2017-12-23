/*
 * created by Zhenyun Yu.
 */

export default class TimeEventController {
    constructor() {
        this._callbacks = {};
        this._enabled = true;
    }

    addListener(name, action) {
        this._callbacks[name] = action;
    }

    removeListener(name) {
        this._callbacks[name] = undefined;
    }

    enable() {
        if (this._enabled) {
            return;
        }
        this._enabled = true;
    }

    disable() {
        if (!this._enabled) {
            return;
        }
        this._enabled = false;
    }

    isEnabled() {
        return this._enabled;
    }

    getCallback() {
        return () => {
            for (let name in this._callbacks) {
                this._callbacks[name]();
            }
        }
    }
}

