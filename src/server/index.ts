import { doGet, doPost, getDocument, updateDetails } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.doPost = doPost;
topLevelFunction.getDocument = getDocument;
topLevelFunction.updateDetails = updateDetails;

export interface ServerGlobals {
  doGet: typeof doGet;
  doPost: typeof doPost;
  getDocument: typeof getDocument;
  updateDetails: typeof updateDetails;
}
