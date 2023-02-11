import { SPREADSHEET_ID } from "../constants";
import { ArrayElement } from "../utils";
import Entity, { PropertyType } from "./Entity";
import Schema from "./Schema";

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

function createJsonRepresentation(
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
  spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
) {
  console.log(JSON.stringify(createJsonRepresentation(schema.entities)));
}
