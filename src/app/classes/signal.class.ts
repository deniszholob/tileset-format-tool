export type SignalCallback<T> = (value: T) => void;

export class Signal<T> {
  private callbacks: Set<SignalCallback<T>> = new Set();

  public send(value: T): void {
    this.callbacks.forEach((callback: SignalCallback<T>): void =>
      callback(value),
    );
  }

  public getListener(): SignalListener<T> {
    return new SignalListener(this.callbacks);
  }
}

/** Not meant to be used as is, exporting for type */
export class SignalListener<T> {
  /** @param callbacks  Pass by reference not by value (i.e. do pass with [...callbacks]), so any modifications should be synced */
  constructor(private callbacks: Set<SignalCallback<T>>) {}

  public listen(callback: SignalCallback<T>): void {
    this.callbacks.add(callback);
  }

  public stopListening(callback: SignalCallback<T>): void {
    this.callbacks.delete(callback);
  }
}
