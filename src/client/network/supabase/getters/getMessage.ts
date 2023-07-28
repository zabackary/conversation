import SupabaseCache from "../cache";
import { ConversationSupabaseClient } from "../utils";

export default async function getMessage(
  client: ConversationSupabaseClient,
  cache: SupabaseCache,
  messageId: number
) {
  const { data: message, error } = await client
    .from("messages")
    .select("*, attachments (*)")
    .eq("id", messageId)
    .single();
  if (error) throw error;
  cache.putAttachment(...message.attachments);
  const { attachments: _, ...normalizedMessage } = message;
  return normalizedMessage;
}
