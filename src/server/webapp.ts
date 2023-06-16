import normalizeException from "normalize-exception";
import { injectHTMLConstants } from "../../plugins/devConstantProvider";
import { DocumentType } from "../client/network/NetworkBackend";
import { gdc, md } from "./gd2-html/addon/gdc.js";

const DEPLOYMENT_EDITOR_HASH = "KmcJi4Ib";
const DEFAULT_CONFIG = {
  baseURL: "",
  versionType: "stable",
  alert: "",
};
const APP_CONFIG_KEY = "app_config";

export function doGet(event: GoogleAppsScript.Events.DoGet) {
  const output = HtmlService.createHtmlOutput();
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const appConfig = {
      ...DEFAULT_CONFIG,
      ...(JSON.parse(
        scriptProperties.getProperty(APP_CONFIG_KEY) ??
          JSON.stringify(DEFAULT_CONFIG)
      ) as GlobalAppConfig),
    };
    let fileName;
    let title;
    switch (event.pathInfo) {
      case null:
      case "/":
      case undefined:
      case "": {
        fileName = "index.html";
        title = "Conversation";
        break;
      }
      case `app_deployment_editor_${DEPLOYMENT_EDITOR_HASH}`: {
        fileName = "updateDetails.html";
        title = "Deployment details";
        break;
      }
      default: {
        fileName = "notFound.html";
        title = "Conversation / 404";
        break;
      }
    }
    output.setContent(
      injectHTMLConstants(
        HtmlService.createHtmlOutputFromFile(fileName).getContent(),
        "APP_CONFIG",
        appConfig
      )
    );
    output.setTitle(title);
  } catch (e) {
    const exception = normalizeException(e);
    output.setContent(/* html */ `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Error</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>

<body>
  <h1>Conversation 4</h1>
  <p>Something went wrong when starting up Conversation (500). Here's the stack 
  trace:</p>
  <pre>
    ${exception.stack ?? exception.name + exception.message}
  </pre>
</body>

</html>`);
    output.setTitle("Conversation / 500");
  }
  return output
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

export function updateDetails(newDetails: Record<string, unknown>) {
  console.log("updating:", newDetails);
  // TODO: Make sure a hash is passed so we can check authenticity
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(APP_CONFIG_KEY, JSON.stringify(newDetails));
}

export function doPost(_event: GoogleAppsScript.Events.DoPost) {
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
