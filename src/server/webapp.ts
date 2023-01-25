/* eslint-disable import/prefer-default-export */
export function doGet() {
  const title = "Conversation";
  const fileName = "index.html";
  console.log("doing get");
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
