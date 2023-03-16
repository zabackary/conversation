import { getCachedSheetRowContent, putCacheSheetRowContent } from "./cache";
import {
  EntityPropertyInitializer,
  Property,
  PropertyType,
  TypedPropertyData,
} from "./Entity";
import { spreadsheetToValue, valueToSpreadsheet } from "./mapSpreadsheetValue";
import migrateDatabase, { createJsonRepresentation } from "./migrateDatabase";
import Schema from "./Schema";
import Unique from "./validators/Unique";

export interface DatabaseAccessor<T extends Schema> {
  /**
   * Migrate the spreadsheet to a new schema, attempting to preserve all data.
   *
   * @param newSchema The new schema
   * @returns A boolean indicating success.
   */
  migrate: (newSchema: Schema) => boolean;

  /**
   * Create an entity.
   */
  createEntity: CreateEntitiesWrapper<T>;

  /**
   * Get an entity by its primary key -- with caching!
   */
  getById: GetByIdWrapper<T>;

  /**
   * Run a pretty simple search algorithm to find exact matches on properties.
   *
   * Basic outline of simpleSearch algorithm:
   *
   * 1. Get search canidates
   *
   *    a. If any property has primaryKey=true and a Unique validator,
   *       skip ahead and just get the row number from the query. Then
   *       short-circuit
   *
   *    b. Gather a list of "hot text" - e.g. the query converted to
   *       strings, run a TextFinder on each of them, then find the
   *       overlapping row numbers. If any property is `Unique`, once a
   *       match is found, short-circuit.
   *
   * 2. Check each canidate to make sure it matches
   *
   * 3. Gather the data then return the `Entities`.
   */
  simpleSearch: SimpleSearchWrapper<T>;

  /**
   * Flush the database to Google Sheets.
   */
  flush: () => void;
}

type CreateEntitiesWrapper<T extends Schema> = {
  [Property in keyof T["entities"]]: (
    data: EntityPropertyInitializer<
      InstanceType<T["entities"][Property]>["schema"]
    >
  ) => InstanceType<T["entities"][Property]>;
};

type GetByIdWrapper<T extends Schema> = {
  [Property in keyof T["entities"]]: (
    id: number
  ) => InstanceType<T["entities"][Property]>;
};

type SimpleSearchWrapper<T extends Schema> = {
  [Property in keyof T["entities"]]: (
    data: Partial<
      TypedPropertyData<InstanceType<T["entities"][Property]>["schema"]>
    >
  ) => InstanceType<T["entities"][Property]>[];
};

export default function loadDatabase<T extends Schema>(
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  schema: T
): DatabaseAccessor<T> {
  createJsonRepresentation(schema.entities);
  return {
    migrate(newSchema) {
      migrateDatabase(newSchema, spreadsheet);
      return true;
    },
    createEntity: Object.fromEntries(
      Object.entries(schema.entities).map(([name, Entity]) => [
        name,
        (data) => {
          const entity = new Entity(spreadsheet);
          entity.initialize(data, null, true);
          return entity;
        },
      ])
    ) as CreateEntitiesWrapper<T>,
    getById: Object.fromEntries(
      Object.entries(schema.entities).map(([name, Entity]) => [
        name,
        (id) => {
          const { schema: tableSchema, tableName } = new Entity(spreadsheet);
          const keys = Object.keys(tableSchema).sort();
          const cached = getCachedSheetRowContent(tableName, id);
          let rowContent: unknown[];
          if (cached) {
            rowContent = cached;
          } else {
            const sheet = spreadsheet.getSheetByName(tableName);
            if (!sheet) throw new Error("Cannot find sheet!");
            [rowContent] = sheet.getSheetValues(id, 1, 1, keys.length);
            putCacheSheetRowContent(tableName, id, rowContent);
          }
          const entity = new Entity(spreadsheet);
          entity.initialize(
            Object.fromEntries(
              rowContent.map((content, index) => [
                keys[index],
                spreadsheetToValue(content),
              ])
            ) as EntityPropertyInitializer<typeof tableSchema>,
            id,
            false
          );
          return entity;
        },
      ])
    ) as GetByIdWrapper<T>,
    simpleSearch: Object.fromEntries(
      Object.entries(schema.entities).map(([name, Entity]) => [
        name,
        (partial) => {
          // Implementation of algorithm in interface above.

          // Set up required information
          const { schema: tableSchema, tableName } = new Entity(spreadsheet);
          const keys = Object.keys(tableSchema).sort();
          const sheet = spreadsheet.getSheetByName(tableName);
          if (!sheet) throw new Error("Can't find sheet");

          // Enumerate properties
          const properties: [string, Property<PropertyType>][] = [];
          for (const property in partial) {
            if (Object.prototype.hasOwnProperty.call(partial, property)) {
              properties.push([property, tableSchema[property]]);
            }
          }
          const getPropertyRank = (
            value: [string, Property<PropertyType>]
          ): 0 | 1 | 2 =>
            // eslint-disable-next-line no-nested-ternary
            (value[1].validators ?? []).some(
              (validator) => validator instanceof Unique
            )
              ? value[1].primaryKey && value[1].type === "number"
                ? 0
                : 1
              : 2;
          properties.sort((a, b) => getPropertyRank(a) - getPropertyRank(b));
          const rankedProperties = properties.map<
            [string, Property<PropertyType>, 0 | 1 | 2]
          >((value) => [...value, getPropertyRank(value)]);

          // Find candidates
          let candidates: number[] = [];
          if (rankedProperties.length > 0) {
            for (const [propertyName, , rank] of rankedProperties) {
              if (rank === 0) {
                candidates.push(Number(partial[propertyName]));
                break;
              } else if (rank === 1) {
                const column = sheet
                  .getSheetValues(
                    2,
                    keys.indexOf(propertyName) + 1,
                    sheet.getLastRow() - 1,
                    1
                  )
                  .flat() as string[];
                candidates.push(
                  column.indexOf(
                    valueToSpreadsheet(partial[propertyName] ?? null)
                  ) + 2
                );
                break;
              } else {
                const indices = sheet
                  .createTextFinder(
                    valueToSpreadsheet(partial[propertyName] ?? null)
                  )
                  .findAll()
                  .map((value) => value.getRowIndex())
                  .filter((value, i, array) => array.indexOf(value) === i);
                if (candidates.length === 0) {
                  candidates.push(...indices);
                } else {
                  candidates = candidates.filter((value) =>
                    indices.includes(value)
                  );
                }
              }
            }
          } else {
            candidates.push(
              ...Array.from({ length: sheet.getLastRow() - 1 }, (v, k) => k + 2)
            );
          }

          // Check!
          // First is the row index, second is the cached row (to speed things up)
          const matches: [number, string[]?][] = [];
          for (const candidate of candidates) {
            const rowContent = sheet.getSheetValues(
              candidate,
              1,
              1,
              keys.length
            )[0] as string[];
            let pass = true;
            for (const key in partial) {
              if (Object.prototype.hasOwnProperty.call(partial, key)) {
                const value = partial[key];
                if (spreadsheetToValue(rowContent[keys.indexOf(key)]) !== value)
                  pass = false;
              }
            }
            if (pass) matches.push([candidate, rowContent]);
          }

          return matches.map((match) => {
            const rowContent =
              match[1] ?? sheet.getSheetValues(match[0], 1, 1, keys.length)[0];
            // TODO: Think about optimizing this with the cache
            const entity = new Entity(spreadsheet);
            entity.initialize(
              Object.fromEntries(
                rowContent.map((content, index) => [
                  keys[index],
                  spreadsheetToValue(content),
                ])
              ) as EntityPropertyInitializer<typeof tableSchema>,
              match[0],
              false
            );
            return entity;
          });
        },
      ])
    ) as SimpleSearchWrapper<T>,
    flush() {
      SpreadsheetApp.flush();
    },
  };
}
