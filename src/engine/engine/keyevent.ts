/*
 * created by Zhenyun Yu.
 */

export default class KeyEventController {
    _callbacks: object;
    _enabled: boolean;
    _listener: (Event) => void;

    constructor() {
        this._callbacks = {};
        this._enabled = false;
        this._listener = (event) => {
            const keyName = event.key;
            if (this._callbacks[keyName] !== undefined) {
                this._callbacks[keyName](event);
            }
        };
    }

    addListener(key, action) {
        this._callbacks[key] = action;
    }

    removeListener(key) {
        this._callbacks[key] = undefined;
    }

    enable() {
        if (this._enabled) {
            return;
        }
        document.addEventListener('keydown', this._listener);
        this._enabled = true;
    }

    disable() {
        if (!this._enabled) {
            return;
        }
        document.removeEventListener('keydown', this._listener);
        this._enabled = false;
    }

    isEnabled() {
        return this._enabled;
    }
}

