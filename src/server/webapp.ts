export function doGet() {
  const title = "Google Apps Script";
  const fileName = "client.html";
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
