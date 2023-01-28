import apiCall from "./api";
import test from "./test";
import { doGet } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.apiCall = apiCall;
topLevelFunction.test = test;

export interface ServerGlobals {
  doGet: typeof doGet;
  apiCall: typeof apiCall;
  test: typeof test;
}
