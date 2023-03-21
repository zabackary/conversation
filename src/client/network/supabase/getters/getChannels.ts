import { ConversationSupabaseClient, normalizeJoin } from "../utils";
import getUser from "./getUser";

export default async function getChannels(
  client: ConversationSupabaseClient,
  dms = false
) {
  const { data: members, error } = await client
    .from("members")
    .select("channels ( *, users!members ( * ) )")
    .is("channels.is_dm", dms)
    .is("accepted", true)
    .eq("user_id", (await getUser(client)).id);
  if (error) throw error;
  return members
    .flatMap((member) => normalizeJoin(member.channels))
    .map((channel) => ({
      ...channel,
      users: normalizeJoin(channel.users),
    }));
}
