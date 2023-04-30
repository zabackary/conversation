import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getChannel(
  client: ConversationSupabaseClient,
  channelId: number
) {
  const { data: channel, error } = await client
    .from("channels")
    .select("*, users!members ( * )")
    .eq("id", channelId)
    .maybeSingle();
  if (error) throw error;
  if (!channel) throw new Error("Couldn't find matching channel");
  return {
    ...channel,
    users: normalizeJoin(channel.users),
  };
}
