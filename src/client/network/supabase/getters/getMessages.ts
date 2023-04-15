import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getMessages(
  client: ConversationSupabaseClient,
  channelId: number,
  limit = 10,
  offset: number | null = null
) {
  const { data: messages, error } = await client
    .from("messages")
    .select("*, messages (*)")
    .eq("channel_id", channelId)
    .order("sent_at", {
      ascending: false,
    })
    .limit(limit);
  if (error) throw error;
  return messages.reverse().map((message) => {
    const { messages: _, ...normalizedMessage } = message;
    const repliedTo = normalizeJoin(message.messages)[0];
    return {
      ...normalizedMessage,
      replying_to: (repliedTo as typeof repliedTo | undefined) ?? null,
    };
  });
}
