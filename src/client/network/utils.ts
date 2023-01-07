import normalizeException from "normalize-exception";
import { CleanSubscribable, Subscribable } from "./network_definitions";

async function wait(): Promise<void>;
async function wait(ms: number): Promise<void>;
async function wait(ms?: number) {
  if (ms === undefined) {
    await new Promise((r) => {
      setTimeout(r, Math.random() * 1000);
    });
  } else {
    await new Promise((r) => {
      setTimeout(r, ms);
    });
  }
}

export { wait };

export function createSubscribable<T>(
  generator: (next: (value: T | Error) => void) => void | Promise<void>,
  initial: T | Error | null = null
): Subscribable<T> {
  let state: T | null | Error = initial;
  const callbacks: ((value: T | Error) => void)[] = [];
  const handleOutput = (value: T | Error) => {
    state = value;
    callbacks.forEach((callback) => callback(value));
  };
  generator(handleOutput)?.catch((error: unknown) =>
    handleOutput(normalizeException(error))
  );
  return {
    subscribe(callback) {
      callbacks.push(callback);
      return () => {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    },
    getSnapshot() {
      return state;
    },
  };
}

export interface DispatchableSubscribable<T> {
  value: Subscribable<T>;
  dispatch: (value: T) => void;
  dispatchError: (value: Error) => void;
}

export function createDispatchableSubscribable<T>(
  initial: T | Error | null = null
): DispatchableSubscribable<T> {
  let state: T | null | Error = initial;
  const callbacks: ((value: T | Error) => void)[] = [];
  const handleOutput = (value: T | Error) => {
    state = value;
    callbacks.forEach((callback) => callback(value));
  };
  return {
    value: {
      subscribe(callback) {
        callbacks.push(callback);
        return () => {
          callbacks.splice(callbacks.indexOf(callback), 1);
        };
      },
      getSnapshot() {
        return state;
      },
    },
    dispatch(value) {
      handleOutput(value);
    },
    dispatchError(value) {
      handleOutput(value);
    },
  };
}

export interface CleanDispatchableSubscribable<T>
  extends DispatchableSubscribable<T> {
  value: CleanSubscribable<T>;
}

export function createCleanDispatchableSubscribable<T>(
  initial: T,
  ...allowNull: [T extends null ? false : true] extends [true]
    ? [false?]
    : [true]
): CleanDispatchableSubscribable<T> {
  const dirty = createDispatchableSubscribable(initial);
  return {
    ...dirty,
    value: {
      ...dirty.value,
      getSnapshot(): T {
        const snapshot = dirty.value.getSnapshot();
        if (!allowNull && snapshot === null) {
          throw new Error("Subscribable is unclean: value is null");
        } else if (snapshot instanceof Error) {
          snapshot.stack = new Error().stack;
          throw snapshot;
        } else {
          // @ts-ignore I think my typings in the parameters as correct.
          return snapshot;
        }
      },
    },
  };
}

export function mapSubscribable<T, S>(
  subscribable: Subscribable<T>,
  map: (value: T | Error) => S | Error | Promise<S | Error>
) {
  const originalSnapshot = subscribable.getSnapshot();
  let promisedUpdate: Promise<S | Error> | null = null;
  return createSubscribable(
    (next) => {
      promisedUpdate?.then(next);
      subscribable.subscribe(async (value) => {
        next(await map(value));
      });
    },
    originalSnapshot === null
      ? null
      : (() => {
          const mapped = map(originalSnapshot);
          if (mapped instanceof Promise) {
            promisedUpdate = mapped;
            return null;
          }
          return mapped;
        })()
  );
}
