"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * EventEmitter&&Observer的超简单实现
 */
class SimpleEventEmitter {
    constructor() {
        this._event = new Map();
        this._onceEvent = new Map();
    }
    _removeListener(mapName, eventName, callback) {
        let newArray = [];
        if (this[mapName].has(eventName)) {
            newArray = this[mapName].get(eventName).filter((value) => {
                return value !== callback;
            });
        }
        this[mapName].set(eventName, newArray);
    }
    /**
     * emit
     */
    emit(eventName, ...args) {
        if (this._event.has(eventName)) {
            for (const fun of this._event.get(eventName)) {
                fun(...args);
            }
        }
        if (this._onceEvent.has(eventName)) {
            for (const fun of this._onceEvent.get(eventName)) {
                fun(...args);
                this._removeListener('_onceEvent', eventName, fun);
            }
        }
    }
    /**
     * on
     */
    on(eventName, callback) {
        if (this._event.has(eventName)) {
            this._event.get(eventName).push(callback);
        }
        else {
            this._event.set(eventName, [callback]);
        }
    }
    /**
     * once
     */
    once(eventName, callback) {
        if (this._onceEvent.has(eventName)) {
            this._onceEvent.get(eventName).push(callback);
        }
        else {
            this._onceEvent.set(eventName, [callback]);
        }
    }
    /**
     * removeListener
     */
    removeListener(eventName, callback) {
        this._removeListener('_event', eventName, callback);
        this._removeListener('_onceEvent', eventName, callback);
    }
    /**
     * removeAllListener
     */
    removeAllListener(eventName) {
        function batch(mapName) {
            if (this[mapName].has(eventName)) {
                this[mapName].delete(eventName);
            }
        }
        ;
        batch.call(this, '_event');
        batch.call(this, '_onceEvent');
    }
}
exports.SimpleEventEmitter = SimpleEventEmitter;
