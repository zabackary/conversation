import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getMessages(
  client: ConversationSupabaseClient,
  channelId: number
) {
  const { data: messages, error } = await client
    .from("messages")
    .select("*, messages (*)")
    .eq("channel_id", channelId);
  if (error) throw error;
  return messages.map((message) => {
    const { messages: _, ...normalizedMessage } = message;
    const repliedTo = normalizeJoin(message.messages)[0];
    return {
      ...normalizedMessage,
      replying_to: (repliedTo as typeof repliedTo | undefined) ?? null,
    };
  });
}
