import apiCall from "./api";
import test from "./test";
import { doGet, doPost } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.doPost = doPost;
topLevelFunction.apiCall = apiCall;
topLevelFunction.test = test;

export interface ServerGlobals {
  doGet: typeof doGet;
  doPost: typeof doPost;
  apiCall: typeof apiCall;
  test: typeof test;
}
