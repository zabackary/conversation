import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getChannel(
  client: ConversationSupabaseClient,
  channelId: number
) {
  const { data: channel, error } = await client
    .from("channels")
    .select("*, users!members ( * )")
    .eq("id", channelId)
    .single();
  if (error) throw error;
  return {
    ...channel,
    users: normalizeJoin(channel.users),
  };
}
