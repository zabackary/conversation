// TODO move to directory
/* eslint-disable max-classes-per-file */

import normalizeException from "normalize-exception";

export default class Subscribable<T>
  implements SubscribableLike<T>, AsyncIterable<T>
{
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

  [Symbol.asyncIterator](): AsyncIterator<T, never, undefined> {
    throw new Error(
      "Async iteratable support is planned but not yet implemented."
    );
  }

  next() {
    return new Promise<T>((resolve, reject) => {
      const unsubscribe = this.subscribe(({ value, error }) => {
        unsubscribe();
        if (error) reject(error);
        else resolve(value);
      });
    });
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
    return new Subscribable<U>((next, nextError) => {
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

  mapSync<U>(mapper: (value: T) => U) {
    return new Subscribable<U>((next, nextError) => {
      this.subscribe(({ value, error }) => {
        if (error) {
          nextError(error);
          return;
        }
        try {
          next(mapper(value));
        } catch (e) {
          nextError(normalizeException(e));
        }
      });
    }, mapper(this.getSnapshot()));
  }

  filter<U extends T>(predicate: (value: T) => value is U, initial: U) {
    return new Subscribable<U>((next, nextError) => {
      this.subscribe(({ value, error }) => {
        if (error) {
          nextError(error);
          return;
        }
        if (predicate(value)) next(value);
      });
      const snapshot = this.getSnapshot();
      if (predicate(snapshot)) next(snapshot);
    }, initial);
  }

  static all<T extends Subscribable<unknown>[]>(
    subscribables: T
  ): Subscribable<UnwrapSubscribableArray<T>> {
    let currentState: SubscribableCallbackValue<UnwrapSubscribableArray<T>> = {
      value: subscribables.map((subscribable) =>
        subscribable.getSnapshot()
      ) as UnwrapSubscribableArray<T>,
      error: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const output = new DispatchableSubscribable(currentState.value);
    subscribables.forEach((subscribable, subscribableIndex) => {
      subscribable.subscribe(({ value, error }) => {
        if (error) {
          currentState = {
            error,
            value: undefined,
          };
          output.dispatchError(currentState.error);
        } else if (currentState.value) {
          currentState = {
            error: undefined,
            value: currentState.value.map((oldValue, index) =>
              index === subscribableIndex ? value : oldValue
            ) as UnwrapSubscribableArray<T>,
          };
          output.dispatch(currentState.value);
        }
      });
    });
    return output.downgrade();
  }
}

export type UnwrapSubscribable<T extends Subscribable<unknown>> =
  T extends Subscribable<infer U> ? U : never;

type UnwrapSubscribableArray<T extends Subscribable<unknown>[]> = {
  [K in keyof T]: UnwrapSubscribable<T[K]>;
};

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
