import { ConversationSupabaseClient } from "../utils";
import getSession from "./getSession";

export default async function getUser(
  client: ConversationSupabaseClient,
  id: string | null = null
) {
  console.log("getting", id, new Error().stack);
  const userId = id === null ? (await getSession(client)).user.id : id;
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}
