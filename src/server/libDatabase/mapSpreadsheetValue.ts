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
  spreadsheetValue: unknown
): string | number | boolean | null {
  switch (typeof spreadsheetValue) {
    case "string": {
      const number = parseFloat(spreadsheetValue);
      if (!Number.isNaN(number)) return number;
      if (spreadsheetValue === TRUE) return true;
      if (spreadsheetValue === FALSE) return false;
      if (spreadsheetValue === NULL) return null;
      return spreadsheetValue;
    }
    case "boolean":
    case "number": {
      return spreadsheetValue;
    }
    default: {
      throw new Error(
        `Could not convert value of type ${typeof spreadsheetValue} to a JSON type.`
      );
    }
  }
}
