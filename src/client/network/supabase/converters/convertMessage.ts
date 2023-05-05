import Message from "../../../../model/message";
import User from "../../../../model/user";
import { SupabaseMessage } from "../cache";
import deletedUser from "../deletedUser";

export default async function convertMessage(
  dbMessage: SupabaseMessage,
  userById: (id: string) => Promise<User> | User
): Promise<Message> {
  const user = dbMessage.user_id
    ? await userById(dbMessage.user_id)
    : deletedUser;
  if (user.isBot) {
    return {
      user,
      parent: dbMessage.channel_id,
      sent: new Date(dbMessage.sent_at),
      isService: true,
      id: dbMessage.id,
      markdown: dbMessage.markdown,
      attachments: [],
      images: [],
      replied: dbMessage.replying_to ?? undefined,
    };
  }
  return {
    user,
    parent: dbMessage.channel_id,
    sent: new Date(dbMessage.sent_at),
    isService: false,
    id: dbMessage.id,
    markdown: dbMessage.markdown,
    attachments: [],
    images: [],
    replied: dbMessage.replying_to ?? undefined,
  };
}

export function convertMessageSync(
  dbMessage: SupabaseMessage
): Omit<Message, "user" | "isService"> {
  return {
    parent: dbMessage.channel_id,
    sent: new Date(dbMessage.sent_at),
    id: dbMessage.id,
    markdown: dbMessage.markdown,
    attachments: [],
    images: [],
  };
}
