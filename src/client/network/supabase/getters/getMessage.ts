import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getMessage(
  client: ConversationSupabaseClient,
  messageId: number
) {
  const { data: message, error } = await client
    .from("messages")
    .select("*, messages (*)")
    .eq("id", messageId)
    .single();
  if (error) throw error;
  const { messages: _, ...normalizedMessage } = message;
  const repliedTo = normalizeJoin(message.messages)[0];
  return {
    ...normalizedMessage,
    replying_to: (repliedTo as typeof repliedTo | undefined) ?? null,
  };
}
