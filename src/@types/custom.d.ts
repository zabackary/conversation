declare namespace globalThis {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global: { [globalName: string]: any };
  interface Window {
    isLocal?: boolean;
  }
}
