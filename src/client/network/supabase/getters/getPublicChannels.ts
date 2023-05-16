import SupabaseCache from "../cache";
import { ConversationSupabaseClient } from "../utils";

export default async function getChannels(
  client: ConversationSupabaseClient,
  _cache: SupabaseCache
) {
  const { data, error } = await client
    .from("channels")
    .select("*")
    .eq("privacy_level", 0);
  if (error) throw error;
  return data;
}
