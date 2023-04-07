/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import MockBackend from "./mock";
import SupabaseBackend from "./supabase";

const USE_SUPABASE_IN_DEVELOPMENT = true as boolean;

const DefaultBackend =
  process.env.NODE_ENV === "production" || USE_SUPABASE_IN_DEVELOPMENT
    ? SupabaseBackend
    : MockBackend;

export default DefaultBackend;
