import { SPREADSHEET_ID } from "../constants";
import loadDatabase from "../libDatabase";
import { DatabaseAccessor } from "../libDatabase/loadDatabase";
import schema from "./schema";

export default function getDatabaseHandle() {
  return loadDatabase(SpreadsheetApp.openById(SPREADSHEET_ID), schema);
}

export type ConversationDatabaseHandle = DatabaseAccessor<typeof schema>;
