/*
 * created by Zhenyun Yu.
 */

export default class KeyEventController {
    constructor() {
        this.callbacks = {};
        this._enabled = false;
        this.listener = (event) => {
            const keyName = event.key;
            if (this.callbacks[keyName] !== undefined) {
                this.callbacks[keyName](event);
            }
        };
    }

    addListener(key, action) {
        this.callbacks[key] = action;
    }

    enable() {
        if (this._enabled) {
            return;
        }
        document.addEventListener('keydown', this.listener);
        this._enabled = true;
    }

    disable() {
        if (!this._enabled) {
            return;
        }
        document.removeEventListener('keydown', this.listener);
    }

    isEnabled() {
        return this._enabled;
    }
}

