import { ConversationSupabaseClient } from "../utils";

export default async function getSession(client: ConversationSupabaseClient) {
  const {
    data: { session },
    error,
  } = await client.auth.getSession();
  if (error || !session) throw error;
  return session;
}
