/*
 * created by Zhenyun Yu.
 */

export default class TimeEventController {
    private callbacks: { [key: string]: () => void };
    private enabled: boolean;

    constructor() {
        this.callbacks = {};
        this.enabled = true;
    }

    addListener(name: string, action: () => void) {
        this.callbacks[name] = action;
    }

    removeListener(name: string) {
        this.callbacks[name] = undefined;
    }

    enable() {
        if (this.enabled) {
            return;
        }
        this.enabled = true;
    }

    disable() {
        if (!this.enabled) {
            return;
        }
        this.enabled = false;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    getCallback(): () => void {
        return () => {
            for (let name in this.callbacks) {
                if (this.callbacks.hasOwnProperty(name)) {
                    this.callbacks[name]();
                }
            }
        }
    }
}

