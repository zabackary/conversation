import SupabaseCache from "../cache";
import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getChannel(
  client: ConversationSupabaseClient,
  _cache: SupabaseCache,
  channelId: number
) {
  const { data: channel, error } = await client
    .from("channels")
    .select("*, users!members ( * )")
    .eq("id", channelId)
    .eq("members.accepted", true)
    .maybeSingle();
  if (error) throw error;
  if (!channel) throw new Error("Couldn't find matching channel");
  return {
    ...channel,
    users: normalizeJoin(channel.users),
  };
}
