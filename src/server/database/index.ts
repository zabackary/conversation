import { SPREADSHEET_ID } from "../constants";
import loadDatabase from "../libDatabase";
import schema from "./schema";

export default function getDatabaseHandle() {
  return loadDatabase(SpreadsheetApp.openById(SPREADSHEET_ID), schema);
}
