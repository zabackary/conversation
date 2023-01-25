import { SPREADSHEET_ID } from "../constants";
import { keepIfInEnum } from "../utils";

export enum TablePropertyType {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export type TablePropertyAttributeName =
  | "unique"
  | "autoAssign"
  | "primaryKey"
  | "index"
  | "validate"
  | "cache"
  | "foreignKey";

export interface TableProperty {
  key: string;
  type: TablePropertyType;
  nullable: boolean;
  attributes: Partial<Record<TablePropertyAttributeName, string>>;
}

export default function readSchema(
  schemaSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("schema")
): Record<string, TableProperty[]> {
  if (!schemaSheet)
    throw new Error(
      "Cannot find schema. Make sure the sheet is named 'schema' and it's in " +
        "the current spreadsheet."
    );
  const values = schemaSheet.getSheetValues(
    2,
    1,
    schemaSheet.getMaxColumns(),
    4
  );
  const tables: Record<string, TableProperty[]> = {};
  let currentTable: string | null = null;
  for (const row of values) {
    if (row[0] === "" && row[1] === "") {
      break;
    }
    if (row[0] !== "") [currentTable] = row;
    if (currentTable === null) {
      throw new Error("You must specify a table name.");
    }
    if (!tables[currentTable]) tables[currentTable] = [];
    let stringType = String(row[2]);
    let nullable = false;
    if (stringType.endsWith("?")) {
      stringType = stringType.slice(0, -1);
      nullable = true;
    }
    const type = keepIfInEnum(stringType, TablePropertyType);
    if (!type) throw new Error("Invalid type!");
    tables[currentTable].push({
      key: String(row[1]),
      type,
      nullable,
      attributes: Object.fromEntries(
        String(row[3])
          .split(",")
          .map((pair) => {
            const [key, value] = pair
              .split("=")
              .map((item) => item.toLowerCase());
            if (value === "true" || value === undefined) {
              return [key, true];
            }
            if (value === "false") {
              return [key, false];
            }
            if (value === "undefined" || value === "null") {
              return [key, undefined];
            }
            return [key, value];
          })
      ),
    });
  }
  return tables;
}
