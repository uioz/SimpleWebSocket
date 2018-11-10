"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * EventEmitter&&Observer的超简单实现
 */
var SimpleEventEmitter = /** @class */ (function () {
    function SimpleEventEmitter() {
        this._event = new Map();
        this._onceEvent = new Map();
    }
    SimpleEventEmitter.prototype._removeListener = function (mapName, eventName, callback) {
        var newArray = [];
        if (this[mapName].has(eventName)) {
            newArray = this[mapName].get(eventName).filter(function (value) {
                return value !== callback;
            });
        }
        this[mapName].set(eventName, newArray);
    };
    /**
     * emit
     */
    SimpleEventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._event.has(eventName)) {
            for (var _a = 0, _b = this._event.get(eventName); _a < _b.length; _a++) {
                var fun = _b[_a];
                fun.apply(void 0, args);
            }
        }
        if (this._onceEvent.has(eventName)) {
            for (var _c = 0, _d = this._onceEvent.get(eventName); _c < _d.length; _c++) {
                var fun = _d[_c];
                fun.apply(void 0, args);
                this._removeListener('_onceEvent', eventName, fun);
            }
        }
    };
    /**
     * on
     */
    SimpleEventEmitter.prototype.on = function (eventName, callback) {
        if (this._event.has(eventName)) {
            this._event.get(eventName).push(callback);
        }
        else {
            this._event.set(eventName, [callback]);
        }
    };
    /**
     * once
     */
    SimpleEventEmitter.prototype.once = function (eventName, callback) {
        if (this._onceEvent.has(eventName)) {
            this._onceEvent.get(eventName).push(callback);
        }
        else {
            this._onceEvent.set(eventName, [callback]);
        }
    };
    /**
     * removeListener
     */
    SimpleEventEmitter.prototype.removeListener = function (eventName, callback) {
        this._removeListener('_event', eventName, callback);
        this._removeListener('_onceEvent', eventName, callback);
    };
    /**
     * removeAllListener
     */
    SimpleEventEmitter.prototype.removeAllListener = function (eventName) {
        function batch(mapName) {
            if (this[mapName].has(eventName)) {
                this[mapName].delete(eventName);
            }
        }
        ;
        batch.call(this, '_event');
        batch.call(this, '_onceEvent');
    };
    return SimpleEventEmitter;
}());
exports.SimpleEventEmitter = SimpleEventEmitter;
