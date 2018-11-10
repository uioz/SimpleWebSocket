

/**
 * EventEmitter&&Observer的超简单实现
 */
export class SimpleEventEmitter {

    public _event: Map<string, Array<(...args: any) => void>> = new Map();
    public _onceEvent: Map<string, Array<(...args: any) => void>> = new Map();

    private _removeListener(mapName:'_event'|'_onceEvent',eventName:string,callback:(...args:any)=>void){

        let newArray: Array<(...args: any) => void> = [];

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
    public emit(eventName:string,...args:any) {

        if (this._event.has(eventName)){
            for (const fun of this._event.get(eventName)) {
                fun(...args);
            }
        }

        if(this._onceEvent.has(eventName)){
            for (const fun of this._onceEvent.get(eventName)) {
                fun(...args);
                this._removeListener('_onceEvent',eventName,fun);
            }
        }
    }

    /**
     * on
     */
    public on(eventName:string,callback:(...args:any)=>void) {
        
        if(this._event.has(eventName)){
            this._event.get(eventName).push(callback);
        }else{
            this._event.set(eventName,[callback]);
        }

    }

    /**
     * once
     */
    public once(eventName: string, callback: (...args: any) => void) {
        if (this._onceEvent.has(eventName)) {
            this._onceEvent.get(eventName).push(callback);
        } else {
            this._onceEvent.set(eventName, [callback]);
        }
    }

    /**
     * removeListener
     */
    public removeListener(eventName: string, callback: (...args: any) => void) {
        
        this._removeListener('_event',eventName,callback);
        this._removeListener('_onceEvent', eventName, callback);

    }

    /**
     * removeAllListener
     */
    public removeAllListener(eventName:string) {
        
        function batch<T extends keyof SimpleEventEmitter>(mapName: T) {
            if (this[mapName].has(eventName)) {
                this[mapName].delete(eventName);
            }
        };

        batch.call(this,'_event');
        batch.call(this, '_onceEvent');

    }

}

