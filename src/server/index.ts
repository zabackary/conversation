import apiCall from "./api";
import test from "./test";
import { doGet } from "./webapp";

global.doGet = doGet;
global.apiCall = apiCall;
global.test = test;

export interface ServerGlobals {
  doGet: typeof doGet;
  apiCall: typeof apiCall;
  test: typeof test;
}
