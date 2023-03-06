import { SPREADSHEET_ID } from "../constants";
import loadDatabase, { Schema } from "../libDatabase";
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
   * @param fastAccess Whether to cache the parts of the entity in
   * `PropertiesService`
   * @returns An instance of the entity
   */
  subscribe: <U extends keyof T["entities"]>(
    tableName: U,
    rowNumber: number,
    lastKnownGood: Date,
    fastAccess: boolean
  ) => InstanceType<T["entities"][U]>;

  /**
   * Get an entity efficiently based on the row number and timestamp. Row
   * numbers are *not validated* if it's found in the database already.
   * @param tableName The table to query from
   * @param criteria Whether to match
   * @param lastKnownGood The last timestamp checked.
   * @param fastAccess Whether to cache the parts of the entity in
   * {@link PropertiesService}
   * @returns New entities since {@link lastKnownGood `lastKnownGood`}
   */
  listen: <U extends keyof T["entities"]>(
    tableName: U,
    criteria: TypedPropertyData<InstanceType<T["entities"][U]>["schema"]>,
    lastKnownGood: Date,
    fastAccess: boolean
  ) => InstanceType<T["entities"][U]>[];

  /**
   * Notify the db to update {@link PropertiesService}
   * @param tableName The table name
   * @param newEntity The changed entity
   */
  notifyChanged: <U extends keyof T["entities"]>(
    tableName: U,
    newEntity: InstanceType<T["entities"][U]>
  ) => void;
}

export default function getDatabaseHandle() {
  return loadDatabase(SpreadsheetApp.openById(SPREADSHEET_ID), schema);
}

export type ConversationDatabaseHandle = DatabaseAccessor<typeof schema>;
