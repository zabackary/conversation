import BaseValidator from "./validators/BaseValidator";

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

export type TypedProperty<T extends Property<PropertyType>> =
  T["nullable"] extends true
    ? PropertyTypeMap[T["type"]] | null
    : PropertyTypeMap[T["type"]];

export type EntityPropertyInitializer<T extends Entity["schema"]> = {
  [P in keyof T]: T[P]["autoAssign"] extends true
    ? undefined
    : TypedProperty<T[P]>;
};

export type TypedPropertyData<T extends Entity["schema"]> = {
  [P in keyof T]: TypedProperty<T[P]>;
};

export default abstract class Entity {
  abstract schema: Record<string, Property<PropertyType>>;

  abstract tableName: string;

  #properties?: TypedPropertyData<this["schema"]>;

  unsaved = false;

  get isInitialized() {
    return this.#properties !== undefined;
  }

  get properties() {
    if (!this.isInitialized)
      throw new Error("Entity has not been initialized yet");
    return this.#properties;
  }

  constructor(private sheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  initialize(data: EntityPropertyInitializer<this["schema"]>) {
    // TODO: implement
  }

  setProperty<T extends keyof this["schema"]>(
    name: T,
    value: TypedProperty<this["schema"][T]>
  ) {
    if (!this.#properties) throw new Error("Uninitialized");
    this.#properties[name] = value;
    this.unsaved = true;
  }

  save() {
    // TODO: implement
    SpreadsheetApp.flush();
  }
}
