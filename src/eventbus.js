/** @module Constants */
/**
 * @name
 * @desc Key word
 * @type {string}
 * @private
 * @memberof Constants
 */
const kSubscriptionKeyWord = "subscription";

/**
 * @name
 * @type {EventTarget}
 * @desc Default event target channel. Constant.
 * @private
 * @memberof Constants
 */
const kBroadcast = new EventTarget();

/**
 * Channels map String->EventTarget
 * @class [ChannelsMap]
 * @private
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
 * @constant
 * @default
 * @desc
 * @memberof Constants
 */
const kBroadcastChannel = "channel:broadcast";

export const kAnyTopic = '*';

/**
 * @class [EventBus]
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
     * @param {string} [event={@link kAnyTopic}] event
     * @param {function|object} cb
     * @param {string} channel
     */
    subscribe(event = kAnyTopic, cb, channel = kBroadcastChannel) {
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
     *
     * @param {string} [topic={@link kAnyTopic}] topic
     * @param {string} channel
     * @return {Observable<*>} hot observable of the channel
     */
    observe(topic = kAnyTopic, channel = kBroadcastChannel) {
        return fromEvent(this._channels.get(channel), topic);
    }

    /**
     * @name
     * @param {string} [event={@link kAnyTopic}] event
     * @param {*} msg
     * @param {string} channel
     */
    publish(event = kAnyTopic, msg, channel = kBroadcastChannel) {
        if (event != kAnyTopic)
            this._channels.get(channel).dispatchEvent(new CustomEvent(event, {
                detail: msg
            }));
        this._channels.get(channel).dispatchEvent(new CustomEvent(kAnyTopic, {
            detail: msg
        }));
    }

    /**
     * @name
     * @desc Does nothing if provided cb is not registered
     * @param {string} [event={@link kAnyTopic}] event
     * @param {function|object} cb
     * @param {string} channel
     */
    unsubscribe(event = kAnyTopic, cb, channel = kBroadcastChannel) {
        if (this._callbacks.has(cb)) {
            this._channels.get(channel).removeEventListener(event, this._callbacks.get(cb));
            this._callbacks.delete(cb);
        }
    }
}