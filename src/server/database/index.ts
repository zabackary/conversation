import { SPREADSHEET_ID } from "../constants";
import loadDatabase, { Schema } from "../libDatabase";
import { isStale } from "../libDatabase/cache";
import { TypedPropertyData } from "../libDatabase/Entity";
import { DatabaseAccessor } from "../libDatabase/loadDatabase";
import schema from "./schema";

export interface SubscribableDatabaseAccessor<T extends Schema>
  extends DatabaseAccessor<T> {
  /**
   * Get an entity efficiently based on the row number and timestamp. Row
   * numbers are *not validated* if it's found in the database already.
   * @param tableName The table to query from
   * @param rowNumber The row number of the watched entity; should be the
   * primary key
   * @param lastKnownGood The last timestamp checked.
   * @returns An instance of the entity or `null` if no change.
   */
  subscribe: <U extends keyof T["entities"]>(
    tableName: U,
    rowNumber: number,
    lastKnownGood: Date
  ) => InstanceType<T["entities"][U]> | null;

  /**
   * Get new entities from a table if they match a criteria.
   * @param tableName The table to query from
   * @param criteria Whether to match
   * @param lastKnownGood The last timestamp checked.
   * @returns New entities since {@link lastKnownGood `lastKnownGood`}
   */
  listen: <U extends keyof T["entities"]>(
    tableName: U,
    criteria: TypedPropertyData<InstanceType<T["entities"][U]>["schema"]>,
    lastKnownGood: Date,
    fastAccess: boolean
  ) => InstanceType<T["entities"][U]>[];
}

export default function getDatabaseHandle(): ConversationDatabaseHandle {
  const database = loadDatabase(
    SpreadsheetApp.openById(SPREADSHEET_ID),
    schema
  );
  return {
    ...database,
    listen(tableName, criteria, lastKnownGood) {
      throw new Error("Unimplemented");
    },
    subscribe(tableName, rowNumber, lastKnownGood) {
      const stale = isStale(tableName, rowNumber, lastKnownGood);
      if (stale) {
        return database.getById[tableName](rowNumber);
      }
      return null;
    },
  };
}

export type ConversationDatabaseHandle = SubscribableDatabaseAccessor<
  typeof schema
>;
