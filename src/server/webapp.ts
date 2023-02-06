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
