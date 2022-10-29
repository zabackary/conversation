declare namespace globalThis {
  const global: { [globalName: string]: any };
  interface Window {
    isLocal?: boolean;
  }
}