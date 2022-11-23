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

// eslint-disable-next-line import/prefer-default-export
export { wait };
