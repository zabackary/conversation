import { ConversationSupabaseClient } from "../utils";

export default async function getChannels(client: ConversationSupabaseClient) {
  const { data, error } = await client
    .from("channels")
    .select("*")
    .eq("privacy_level", 0);
  if (error) throw error;
  return data;
}
