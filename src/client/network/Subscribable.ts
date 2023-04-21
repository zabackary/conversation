// TODO move to directory
/* eslint-disable max-classes-per-file */

export default class Subscribable<T> implements SubscribableLike<T> {
  private value: T;

  private lastError: Error | undefined;

  private callbacks: SubscribableCallback<T>[];

  constructor(
    generator: (
      next: (value: T) => void,
      nextError: (value: Error) => void
    ) => Promise<void> | void,
    initialValue: T
  ) {
    this.value = initialValue;
    this.callbacks = [];
    void generator(this.handleValue.bind(this), this.handleError.bind(this));
  }

  protected handleValue(value: T) {
    this.value = value;
    this.callbacks.forEach((callback) => callback({ value, error: undefined }));
  }

  protected handleError(error: Error) {
    this.lastError = error;
    this.callbacks.forEach((callback) => callback({ value: undefined, error }));
  }

  subscribe(callback: SubscribableCallback<T>): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks.splice(this.callbacks.indexOf(callback), 1);
    };
  }

  getSnapshot(): T {
    return this.value;
  }

  map<U>(mapper: (value: T) => Promise<U>, initial: U) {
    return new Subscribable((next, nextError) => {
      this.subscribe(({ value, error }) => {
        if (error) {
          nextError(error);
          return;
        }
        mapper(value).then(next).catch(nextError);
      });
      mapper(this.getSnapshot()).then(next).catch(nextError);
    }, initial);
  }
}

export class DispatchableSubscribable<T> extends Subscribable<T> {
  constructor(initialValue: T);

  constructor(
    generator: (
      next: (value: T) => void,
      nextError: (value: Error) => void
    ) => Promise<void> | void,
    initialValue: T
  );

  constructor(
    generatorOrValue: SubscribableGenerator<T> | T,
    initialValue?: T
  ) {
    if (initialValue) {
      super(generatorOrValue as SubscribableGenerator<T>, initialValue);
    } else {
      super(() => {
        // Noop
      }, generatorOrValue as T);
    }
  }

  dispatch(value: T) {
    this.handleValue(value);
  }

  dispatchError(value: Error) {
    this.handleError(value);
  }

  downgrade() {
    // TODO: Actually downgrade it. This would work in actual typed languages
    // but doesn't in TS.
    return this as Subscribable<T>;
  }
}

export interface SubscribableLike<T> {
  /**
   * Listen for changes to the subscribable. Cancel with the returned function.
   * @param callback The callback to call on change.
   */
  subscribe(callback: SubscribableCallback<T>): () => void;

  /**
   * Return the latest non-error value.
   */
  getSnapshot(): T;
}

export type SubscribableCallback<T> = (
  value: SubscribableCallbackValue<T>
) => void;

export type SubscribableCallbackValue<T> =
  | {
      value: T;
      error: undefined;
    }
  | {
      value: undefined;
      error: Error;
    };

export type SubscribableGenerator<T> = (
  next: (value: T) => void,
  nextError: (value: Error) => void
) => Promise<void> | void;
