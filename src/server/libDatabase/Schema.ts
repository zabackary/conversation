import Entity from "./Entity";

export default interface Schema {
  version: number;
  entities: Record<
    string,
    { new (sheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Entity }
  >;
}
