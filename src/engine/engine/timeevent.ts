/*
 * created by Zhenyun Yu.
 */

export default class TimeEventController {
    _callbacks: { [key: string]: () => void };
    _enabled: boolean;

    constructor() {
        this._callbacks = {};
        this._enabled = true;
    }

    addListener(name: string, action: () => void) {
        this._callbacks[name] = action;
    }

    removeListener(name: string) {
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

    isEnabled(): boolean {
        return this._enabled;
    }

    getCallback(): () => void {
        return () => {
            for (let name in this._callbacks) {
                if (this._callbacks.hasOwnProperty(name)) {
                    this._callbacks[name]();
                }
            }
        }
    }
}

