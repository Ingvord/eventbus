const kSubscriptionKeyWord = "subscription";

const kBroadcast = new EventTarget();

/**
 * Channels map String->EventTarget
 *
 */
class ChannelsMap extends Map{
    constructor(){
        super();
    }

    get(id){
        return this.has(id) ?
            super.get(id):
            this.set(id, new EventTarget()).get(id);
    }
}

/**
 * Default channel
 *
 * @type {string}
 */
const kBroadcastChannel = "broadcast";

export class EventBus {
    constructor() {
        this._channels = new ChannelsMap();
        this._channels.set(kBroadcastChannel, kBroadcast);
        this._callbacks = new Map();
    }

    /**
     *
     * @param {string} event
     * @param {function|object} cb
     * @param {string} channel
     */
    subscribe(event, cb, channel = kBroadcastChannel) {
        console.debug(typeof cb);
        if (typeof cb == 'function') {
            const handler = (msg) => {
                cb(msg.detail)
            };
            this._channels.get(channel).addEventListener(event, handler);
            this._callbacks.set(cb, handler);
        } else if (typeof cb == 'object') {
            const handler = cb[`${event} ${kSubscriptionKeyWord}`];
            if (handler === undefined)
                throw new Error(`Callback object has no method handler for ${event}. Please define a method called "${event} ${kSubscriptionKeyWord}"`);
            const handlerClosure = handler.bind(cb);
            this._channels.get(channel).addEventListener(event, handlerClosure);
            this._callbacks.set(cb, handlerClosure);
        } else {
            throw new Error(`Unsupported callback type ${typeof cb}. Must be either function or object`);
        }
    }

    /**
     *
     * @param {string} event
     * @param {*} msg
     * @param {string} channel
     */
    publish(event, msg, channel = kBroadcastChannel) {
        this._channels.get(channel).dispatchEvent(new CustomEvent(event, {
            detail: msg
        }));
    }

    /**
     * Does nothing if provided cb is not registered
     *
     * @param {string} event
     * @param {function|object} cb
     * @param {string} channel
     */
    unsubscribe(event, cb, channel = kBroadcastChannel) {
        const handler = this._callbacks.get(cb);
        if (handler === undefined) return;
        this._channels.get(channel).removeEventListener(event, handler);
        this._callbacks.delete(cb);
    }
}