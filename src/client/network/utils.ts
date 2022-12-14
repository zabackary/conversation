import { Subscribable } from "./network_definitions";

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

function createSubscribable<T>(
  generator: (next: (value: T) => void) => void | Promise<void>,
  initial: T | null = null
): Subscribable<T> {
  let state = initial;
  const callbacks: ((value: T) => void)[] = [];
  generator((value) => {
    state = value;
    callbacks.forEach((callback) => {
      callback(value);
    });
  });
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

export { wait, createSubscribable };
