import SupabaseCache from "../cache";
import { ConversationSupabaseClient } from "../utils";

export default async function getAttachment(
  client: ConversationSupabaseClient,
  _cache: SupabaseCache,
  attachmentId: string
) {
  const { data: attachment, error } = await client
    .from("attachments")
    .select("*")
    .eq("id", attachmentId)
    .maybeSingle();
  if (error) throw error;
  if (!attachment) throw new Error("Couldn't find matching channel");
  return attachment;
}
