import NetworkBackend, { DocumentType } from "../NetworkBackend";

export default class GasBackend implements Pick<NetworkBackend, "getDocument"> {
  getDocument(documentType: DocumentType): Promise<string> {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getDocument(documentType);
    });
  }
}
