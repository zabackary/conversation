import { expBackoff } from "./server_utils";

type PropertyStoreType = "user" | "script" | "document";
interface PropertyStore {
  user?: GoogleAppsScript.Properties.Properties;
  script?: GoogleAppsScript.Properties.Properties;
  document?: GoogleAppsScript.Properties.Properties;
}
const store: PropertyStore = {};
function getPropertyStore(
  type: PropertyStoreType
): GoogleAppsScript.Properties.Properties {
  const cached = store[type];
  if (cached) {
    return cached;
  }
  let foundStore: GoogleAppsScript.Properties.Properties | null;
  switch (type) {
    case "user": {
      foundStore = expBackoff(() => PropertiesService.getUserProperties());
      break;
    }
    case "script": {
      foundStore = expBackoff(() => PropertiesService.getScriptProperties());
      break;
    }
    case "document": {
      foundStore = expBackoff(() => PropertiesService.getDocumentProperties());
      break;
    }
  }
  if (foundStore === null) throw new Error("Cannot get property store.");
  return foundStore;
}

export function getProperty(name: string, type: PropertyStoreType = "script") {
  return getPropertyStore(type).getProperty(name) || "";
}

export function setProperty(
  name: string,
  value: string,
  type: PropertyStoreType = "script"
) {
  getPropertyStore(type).setProperty(name, value);
}

export function deleteProperty(
  name: string,
  type: PropertyStoreType = "script"
) {
  getPropertyStore(type).deleteProperty(name);
}
