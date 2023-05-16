import SupabaseCache from "../cache";
import { ConversationSupabaseClient } from "../utils";

export default async function getSession(
  client: ConversationSupabaseClient,
  _cache: SupabaseCache
) {
  const {
    data: { session },
    error,
  } = await client.auth.getSession();
  if (error || !session) throw error;
  return session;
}
