import { ConversationSupabaseClient, normalizeJoin } from "../utils";

export default async function getChannels(
  client: ConversationSupabaseClient,
  userId: string
) {
  const { data: members, error } = await client
    .from("members")
    .select("channels ( *, users!members ( * ) )")
    .is("accepted", true)
    .eq("user_id", userId);
  if (error) throw error;
  return members
    .flatMap((member) => normalizeJoin(member.channels))
    .map((channel) => ({
      ...channel,
      users: normalizeJoin(channel.users),
    }));
}
