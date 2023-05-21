import { DocumentType } from "../client/network/NetworkBackend";
import { gdc, md } from "./gd2-html/addon/gdc.js";

export function doGet() {
  let output: GoogleAppsScript.HTML.HtmlOutput | undefined;
  try {
    output = HtmlService.createHtmlOutputFromFile("index.html");
  } catch (e) {
    output = HtmlService.createHtmlOutput(
      "<h1>Conversation 4</h1><em>Fatal error: Cannot find <code>index.html</code></em>"
    );
  }
  return output
    .setTitle("Conversation")
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

export function doPost() {
  throw new Error("Conversation does not support HTTP POST.");
}

export function getDocument(documentType: DocumentType) {
  const cache = CacheService.getScriptCache();
  const cacheKey = `md-document-${documentType}`;
  const maybeEntry = cache.get(cacheKey);
  if (maybeEntry) return maybeEntry;
  let url: string | undefined;
  switch (documentType) {
    case DocumentType.PRIVACY_POLICY:
      url = import.meta.env.CLIENT_PRIVACY_POLICY_URL;
      break;
    case DocumentType.TERMS_OF_SERVICE:
      url = import.meta.env.CLIENT_TOS_URL;
      break;
  }
  /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  gdc.init(gdc.docTypes.md);
  const markdown = md.doMarkdown(
    {
      recklessMode: true,
    },
    url
  ) as string;
  /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  cache.put(cacheKey, markdown);
  return markdown;
}
