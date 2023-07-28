import SupabaseCache from "../cache";
import { ConversationSupabaseClient } from "../utils";

export default async function getMessages(
  client: ConversationSupabaseClient,
  cache: SupabaseCache,
  channelId: number,
  limit = 10,
  lastDate = new Date()
) {
  const { data: messages, error } = await client
    .from("messages")
    .select("*, attachments(*)")
    .eq("channel_id", channelId)
    .order("sent_at", {
      ascending: false,
    })
    .lt("sent_at", lastDate.toISOString())
    .range(0, limit - 1);
  if (error) throw error;
  messages.forEach((message) => cache.putAttachment(...message.attachments));
  const normalizedMessages = messages.map(
    ({ attachments: _, ...message }) => message
  );
  cache.putMessage(...normalizedMessages);
  return normalizedMessages.reverse();
}
