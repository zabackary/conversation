import { doGet, doPost, getDocument } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.doPost = doPost;
topLevelFunction.getDocument = getDocument;

export interface ServerGlobals {
  doGet: typeof doGet;
  doPost: typeof doPost;
  getDocument: typeof getDocument;
}
