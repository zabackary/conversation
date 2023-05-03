/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import NetworkBackend from "./NetworkBackend";
import MockBackend from "./mock";
import SupabaseBackend from "./supabase";

const DefaultBackend: new () => NetworkBackend = (() => {
  if (import.meta.env.BACKEND_MODE === "supabase") {
    return SupabaseBackend;
  }
  if (import.meta.env.BACKEND_MODE === "mock") {
    return MockBackend;
  }
  if (import.meta.env.BACKEND_MODE === "gas") {
    throw new Error(
      "The Google Apps Script backend has been replaced by Supabase."
    );
  } else {
    throw new Error(
      `Cannot find backend mode "${import.meta.env.BACKEND_MODE}"`
    );
  }
})();

export default DefaultBackend;
