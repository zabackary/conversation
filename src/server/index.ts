import { doGet } from "./webapp";

global.doGet = doGet;
export interface ServerGlobals {
  doGet: typeof doGet;
  [key: string]: (...args: unknown[]) => unknown;
}
