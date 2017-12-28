/*
 * created by Zhenyun Yu.
 */

export default class TimeEventController {
    private callbacks: { [key: string]: (elapsedTime: number, deltaTime: number) => void };
    private enabled: boolean;

    constructor() {
        this.callbacks = {};
        this.enabled = true;
    }

    addListener(name: string, action: (elapsedTime: number, deltaTime: number) => void) {
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

    getCallback(): (elapsedTime: number, deltaTime: number) => void {
        return (elapsedTime, deltaTime) => {
            for (let name in this.callbacks) {
                if (this.callbacks.hasOwnProperty(name)) {
                    this.callbacks[name](elapsedTime, deltaTime);
                }
            }
        }
    }
}

