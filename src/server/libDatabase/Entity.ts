import { valueToSpreadsheet } from "./mapSpreadsheetValue";
import BaseValidator from "./validators/BaseValidator";
import Unique from "./validators/Unique";

export const UNASSIGNED = Symbol("autoAssign: unassigned autoAssign");

function computeAutoAssign<T extends PropertyType>(
  schema: Property<T>
): PropertyTypeMap[PropertyType] | typeof UNASSIGNED {
  const validators = schema.validators ?? [];
  const autoAssigned = validators
    .map((validator) => validator.autoAssign())
    .find((a) => a !== null);
  if (autoAssigned) {
    // Yay, one of the validators has a way to auto-assign, we can return.
    return autoAssigned;
  }
  if (
    schema.primaryKey &&
    validators.some((validator) => validator instanceof Unique)
  ) {
    // The property is a primary key and it must be unique! That means we can
    // just use the row number to shortcut things when we do lookup.
    // Right now, it should be unassigned.
    return UNASSIGNED;
  }
  throw new Error("Cannot compute auto-assign");
}

export interface PropertyTypeMap {
  string: string;
  number: number;
  boolean: boolean;
}

export type PropertyType = keyof PropertyTypeMap;

export interface Property<T extends PropertyType> {
  type: T;
  primaryKey?: boolean;
  autoAssign?: boolean;
  createIndex?: boolean;
  nullable?: boolean;
  /**
   * In the format `[tableName].[propertyName]` where the property is `index`ed
   * and is `Unique`. `type` must be the same as that property's type.
   */
  foreignKey?: string;
  validators?: BaseValidator<T>[];
}

type PropertyTypeMapUnassigned<T extends Property<PropertyType>> =
  T["autoAssign"] extends true
    ? PropertyTypeMap[T["type"]] | typeof UNASSIGNED
    : PropertyTypeMap[T["type"]];

export type TypedProperty<T extends Property<PropertyType>> =
  T["nullable"] extends true
    ? PropertyTypeMapUnassigned<T> | null
    : PropertyTypeMapUnassigned<T>;

/* export type EntityPropertyInitializer<T extends Entity["schema"]> = {
  [P in keyof T]: T[P]["autoAssign"] extends true
    ? undefined
    : TypedProperty<T[P]>;
}; */

export type EntityPropertyInitializer<T extends Entity["schema"]> = {
  [Key in keyof T]: T[Key]["autoAssign"] extends true
    ? undefined
    : TypedProperty<T[Key]>;
};

export type TypedPropertyData<T extends Entity["schema"]> = {
  [P in keyof T]: TypedProperty<T[P]>;
};

export default abstract class Entity {
  abstract schema: Record<string, Property<PropertyType>>;

  abstract tableName: string;

  #properties?: TypedPropertyData<this["schema"]>;

  unsaved = false;

  rowNumber: number | null = null;

  get isInitialized() {
    return this.#properties !== undefined;
  }

  get properties() {
    if (!this.isInitialized)
      throw new Error("Entity has not been initialized yet");
    return this.#properties;
  }

  #sheet: GoogleAppsScript.Spreadsheet.Sheet | undefined;

  get sheet() {
    if (this.#sheet) {
      return this.#sheet;
    }
    const sheet = this.spreadsheet.getSheetByName(this.tableName);
    if (!sheet) throw new Error("Cannot find corresponding sheet.");
    this.#sheet = sheet;
    return sheet;
  }

  constructor(private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  initialize(
    data: EntityPropertyInitializer<this["schema"]>,
    rowNumber: number | null,
    unsaved: boolean
  ) {
    this.rowNumber = rowNumber;
    if (unsaved) this.unsaved = true;
    const newProperties: Partial<TypedPropertyData<this["schema"]>> = {};
    for (const property in this.schema) {
      if (Object.prototype.hasOwnProperty.call(this.schema, property)) {
        const value = data[property as keyof typeof data];
        if (typeof value === "undefined") {
          if (!this.schema[property].autoAssign)
            throw new Error("Must specify value if not undefined");
          // @ts-ignore It's from the same schema.
          newProperties[property] = computeAutoAssign(this.schema[property]);
        } else {
          // @ts-ignore It's fine...
          newProperties[property] = value;
        }
      }
    }
    // Validation loop for safe cast
    for (const property in this.schema) {
      if (!(property in newProperties)) {
        throw new Error("Incomplete data");
      }
    }
    this.#properties = newProperties as TypedPropertyData<this["schema"]>;
  }

  setProperty<T extends keyof this["schema"]>(
    name: T,
    value: TypedProperty<this["schema"][T]>
  ) {
    if (!this.#properties) throw new Error("Uninitialized");
    this.#properties[name] = value;
    this.unsaved = true;
  }

  save(immediateFlush = true) {
    if (!this.unsaved) return;
    if (this.#properties === undefined) throw new Error("Not initialized");
    const newRow =
      this.rowNumber === null ? this.sheet.getLastRow() + 1 : this.rowNumber;
    const sortedSchema = Object.keys(this.schema).sort();
    const values: Exclude<
      TypedProperty<this["schema"][string]>,
      typeof UNASSIGNED
    >[] = [];
    for (const name of sortedSchema) {
      let value = this.#properties[name];
      // @ts-ignore It's fine if we polute our db, I think... Don't get mad
      // later.
      if (value === UNASSIGNED) value = newRow;
      values.push(value as Exclude<typeof value, typeof UNASSIGNED>);
    }
    if (this.rowNumber === null) {
      this.sheet.appendRow(values.map((value) => valueToSpreadsheet(value)));
    } else {
      this.sheet
        .getRange(this.rowNumber, 1, 1, sortedSchema.length)
        .setValues([values.map((value) => valueToSpreadsheet(value))]);
    }

    if (immediateFlush) SpreadsheetApp.flush();
  }
}
