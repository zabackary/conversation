import { ConversationSupabaseClient } from "../utils";

export default async function getMessage(
  client: ConversationSupabaseClient,
  messageId: number
) {
  const { data: message, error } = await client
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();
  if (error) throw error;
  return message;
}
