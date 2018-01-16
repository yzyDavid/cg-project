/*
 * created by Zhenyun Yu.
 */

/*
 * document on Event types:
 * https://developer.mozilla.org/zh-CN/docs/Web/Events
 */

export type MouseEventType = 'mousedown' | 'mouseup' | 'mousemove' | 'click' | 'dblclick';
const mouseEventTypes: MouseEventType[] = [
    'mousedown',
    'mouseup',
    'mousemove',
    'click',
    'dblclick'
];

export default class MouseEventController {
    private enabled: boolean;
    private callbacks: { [keyName: string]: { type: MouseEventType, fn: (e: MouseEvent) => void } };
    private listeners: { [eventType: string]: (e: MouseEvent) => void };

    constructor() {
        this.enabled = false;
        this.callbacks = {};
        this.listeners = {};
        for (let e of mouseEventTypes) {
            this.listeners[e] = (event: MouseEvent) => {
                for (let c in this.callbacks) {
                    if (this.callbacks[c].type === e) {
                        this.callbacks[c].fn(event);
                    }
                }
            }
        }
    }

    addListener(key: string, type: MouseEventType, action: (e: MouseEvent) => void) {
        this.callbacks[key] = {type: type, fn: action};
    }

    removeListener(key: string) {
        this.callbacks[key] = undefined;
    }

    enable() {
        if (this.enabled) {
            return;
        }
        console.log("listener", this.listeners);
        for (let e in this.listeners) {
            document.addEventListener(e, this.listeners[e]);
            console.log("e", e);
            console.log("listeners[e]", this.listeners[e]);
        }
        this.enabled = true;
    }

    disable() {
        if (!this.enabled) {
            return;
        }
        for (let e in this.listeners) {
            document.removeEventListener(e, this.listeners[e]);
        }
        this.enabled = false;
    }
}
