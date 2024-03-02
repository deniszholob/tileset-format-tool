export class Signal {
    callbacks = new Set();
    send(value) {
        this.callbacks.forEach((callback) => callback(value));
    }
    getListener() {
        return new SignalListener(this.callbacks);
    }
}
/** Not meant to be used as is, exporting for type */
export class SignalListener {
    callbacks;
    /** @param callbacks  Pass by reference not by value (i.e. do pass with [...callbacks]), so any modifications should be synced */
    constructor(callbacks) {
        this.callbacks = callbacks;
    }
    listen(callback) {
        this.callbacks.add(callback);
    }
    stopListening(callback) {
        this.callbacks.delete(callback);
    }
}
