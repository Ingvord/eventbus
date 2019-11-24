const kSubscriptionKeyWord = "subscription";

export class EventBus {
    constructor() {
        this._target = new EventTarget();
        this._callbacks = new Map();
    }

    /**
     *
     * @param {string} event
     * @param {function|object} cb
     */
    subscribe(event, cb) {
        console.debug(typeof cb);
        if (typeof cb == 'function') {
            const handler = (msg) => {
                cb(msg.detail)
            };
            this._target.addEventListener(event, handler);
            this._callbacks.set(cb, handler);
        } else if (typeof cb == 'object') {
            const handler = cb[`${event} ${kSubscriptionKeyWord}`];
            if (handler === undefined)
                throw new Error(`Callback object has no method handler for ${event}. Please define a method called "${event} ${kSubscriptionKeyWord}"`);
            const handlerClosure = handler.bind(cb);
            this._target.addEventListener(event, handlerClosure);
            this._callbacks.set(cb, handlerClosure);
        } else {
            throw new Error(`Unsupported callback type ${typeof cb}. Must be either function or object`);
        }
    }

    publish(event, msg) {
        this._target.dispatchEvent(new CustomEvent(event, {
            detail: msg
        }));
    }

    /**
     * Does nothing if provided cb is not registered
     *
     * @param {string} event
     * @param {function|object} cb
     */
    unsubscribe(event, cb) {
        const handler = this._callbacks.get(cb);
        if (handler === undefined) return;
        this._target.removeEventListener(event, handler);
        this._callbacks.delete(cb);
    }
}