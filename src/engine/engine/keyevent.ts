/*
 * created by Zhenyun Yu.
 */

export default class KeyEventController {
    private callbacks: {[keyName: string]: (e?: KeyboardEvent) => void};
    private enabled: boolean;
    private listener: (e?: KeyboardEvent) => void;

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

    addListener(key: string, action: (e?: KeyboardEvent) => void) {
        this.callbacks[key] = action;
    }

    removeListener(key: string) {
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

