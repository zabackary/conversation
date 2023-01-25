import { SPREADSHEET_ID } from "../constants";
import readSchema from "./readSchema";

export default function migrateDatabase(
  spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID),
  schema = readSchema(spreadsheet.getSheetByName("schema"))
) {
  const activeSchemaSheet = spreadsheet.getSheetByName("_activeSchema");
  const activeSchema = activeSchemaSheet ? readSchema(activeSchemaSheet) : {};
  for (const tableName in schema) {
    if (activeSchema[tableName]) {
      // Table already exists; attempt to migrate
      throw new Error(
        `Table "${tableName}" already exists and cannot be migrated.`
      );
    } else {
      const sheet = spreadsheet.insertSheet(tableName);
      const tableSchema = schema[tableName];
      sheet.appendRow(tableSchema.map((property) => property.key));
      sheet.setFrozenRows(1);
    }
  }
}
