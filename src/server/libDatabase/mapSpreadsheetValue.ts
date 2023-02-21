import { UNASSIGNED } from "./Entity";

const TRUE = "TRUE";
const FALSE = "FALSE";
const NULL = "#N/A";

export function valueToSpreadsheet(
  value: string | number | boolean | null | typeof UNASSIGNED
): string {
  if (value === UNASSIGNED)
    throw new Error("Cannot seralize unassigned to spreadsheet.");
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === null) return NULL;
  return String(value);
}

export function spreadsheetToValue(
  spreadsheetValue: string
): string | number | boolean | null {
  const number = parseFloat(spreadsheetValue);
  if (!Number.isNaN(number)) return number;
  if (spreadsheetValue === TRUE) return true;
  if (spreadsheetValue === FALSE) return false;
  if (spreadsheetValue === NULL) return null;
  return spreadsheetValue;
}
