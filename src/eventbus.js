/** @module Constants */
/**
 * @name
 * @desc Key word
 * @type {string}
 * @memberof Constants
 */
const kSubscriptionKeyWord = "subscription";

/**
 * @name
 * @desc Default event target channel. Constant.
 * @memberof Constants
 */
const kBroadcast = new EventTarget();

/**
 * @name
 * @desc Name of the default event channel. Constant.
 * @type {string}
 * @memberof Constants
 */
const kBroadcastChannel = "broadcast";

/**
 * @name
 * @desc ChannelsMap maps String (id) -> EventTarget (event target channel).
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
 * @name
 * @desc
 */
export class EventBus {
    /**
     *  @name
     *  @desc Creates channels and callbacks
     */
    constructor() {
        this._channels = new ChannelsMap();
        this._channels.set(kBroadcastChannel, kBroadcast);
        this._callbacks = new Map();
    }

    /**
     * @name
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
            const handlerClosure = (msg) => {
                handler.call(cb, msg.detail);
            };
            this._channels.get(channel).addEventListener(event, handlerClosure);
            this._callbacks.set(cb, handlerClosure);
        } else {
            throw new Error(`Unsupported callback type ${typeof cb}. Must be either function or object`);
        }
    }

    /**
     * @name
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
     * @name
     * @desc Does nothing if provided cb is not registered
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