import { ArrayElement } from "../utils";
import Entity, { PropertyType } from "./Entity";
import Schema from "./Schema";

export const METADATA_SHEET_NAME = "__sheetsDb_metadata";

interface JsonRepresentation {
  tables: {
    name: string;
    properties: {
      name: string;
      type: PropertyType;
    }[];
  }[];
  indices: {
    type: PropertyType;
    table: string;
    tableProperty: string;
  }[];
}

export function createJsonRepresentation(
  tables: Record<string, { new (...args: never[]): Entity }>
) {
  const output: JsonRepresentation = { tables: [], indices: [] };
  for (const tableName in tables) {
    if (Object.prototype.hasOwnProperty.call(tables, tableName)) {
      const { schema } = new tables[tableName]();
      const tableOutput: ArrayElement<JsonRepresentation["tables"]> = {
        name: tableName,
        properties: [],
      };
      for (const propertyName in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, propertyName)) {
          const property = schema[propertyName];
          tableOutput.properties.push({
            name: propertyName,
            type: property.type,
          });
          if (property.createIndex) {
            output.indices.push({
              type: property.type,
              table: tableName,
              tableProperty: propertyName,
            });
          }
        }
      }
      output.tables.push(tableOutput);
    }
  }
  return output;
}

export default function migrateDatabase(
  schema: Schema,
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
) {
  if (!spreadsheet.getSheetByName(METADATA_SHEET_NAME))
    spreadsheet.insertSheet(METADATA_SHEET_NAME);
  const sheets = spreadsheet.getSheets();
  for (const sheet of sheets) {
    if (sheet.getName() !== METADATA_SHEET_NAME) spreadsheet.deleteSheet(sheet);
  }
  for (const newTableClassName in schema.entities) {
    if (
      Object.prototype.hasOwnProperty.call(schema.entities, newTableClassName)
    ) {
      const NewTable = schema.entities[newTableClassName];
      const { schema: tableSchema, tableName } = new NewTable(spreadsheet);
      const sortedSchema = Object.keys(tableSchema).sort();
      const sheet = spreadsheet.insertSheet(tableName);
      sheet.appendRow(sortedSchema);
      sheet.setFrozenRows(1);
    }
  }
}
