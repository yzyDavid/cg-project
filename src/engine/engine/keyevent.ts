/*
 * created by Zhenyun Yu.
 */

export default class KeyEventController {
    private callbacks: object;
    private enabled: boolean;
    private listener: (Event) => void;

    constructor() {
        this.callbacks = {};
        this.enabled = false;
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

    removeListener(key) {
        this.callbacks[key] = undefined;
    }

    enable() {
        if (this.enabled) {
            return;
        }
        document.addEventListener('keydown', this.listener);
        this.enabled = true;
    }

    disable() {
        if (!this.enabled) {
            return;
        }
        document.removeEventListener('keydown', this.listener);
        this.enabled = false;
    }

    isEnabled() {
        return this.enabled;
    }
}

