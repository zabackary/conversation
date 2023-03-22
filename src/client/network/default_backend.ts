/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import MockBackend from "./mock";
import SupabaseBackend from "./supabase";

const DefaultBackend =
  process.env.NODE_ENV === "production" ? SupabaseBackend : MockBackend;

export default DefaultBackend;
