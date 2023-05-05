import { ConversationSupabaseClient } from "../utils";

export default async function getMessages(
  client: ConversationSupabaseClient,
  channelId: number,
  limit = 10,
  offset = 0
) {
  const { data: messages, error } = await client
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("sent_at", {
      ascending: false,
    })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return messages.reverse();
}
