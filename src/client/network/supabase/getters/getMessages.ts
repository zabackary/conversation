import SupabaseCache from "../cache";
import { ConversationSupabaseClient } from "../utils";

export default async function getMessages(
  client: ConversationSupabaseClient,
  cache: SupabaseCache,
  channelId: number,
  limit = 10,
  offset = 0
) {
  const { data: messages, error } = await client
    .from("messages")
    .select("*, attachments(*)")
    .eq("channel_id", channelId)
    .order("sent_at", {
      ascending: false,
    })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  const normalizedMessages = messages.map(
    ({ attachments: _, ...message }) => message
  );
  cache.putMessage(...normalizedMessages);
  return normalizedMessages.reverse();
}
