import ejs from "ejs";

export function template(file: string, data: ejs.Data) {
  const fileContent = HtmlService.createHtmlOutputFromFile(file).getContent();
  const rendered = ejs.render(fileContent, data, {
    filename: file,
  });
  return rendered;
}
