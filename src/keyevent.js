/*
 * created by Zhenyun Yu.
 */

class KeyEventController {
    constructor() {
        this.callbacks = {};
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
    }
}

const controller = new KeyEventController();
export default controller;
