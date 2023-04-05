import Message from "../../../../model/message";
import User from "../../../../model/user";
import { SupabaseMessage } from "../cache";

export default async function convertMessage(
  dbMessage: SupabaseMessage,
  userById: (id: string) => Promise<User> | User
): Promise<Message> {
  const user = await userById(dbMessage.user_id);
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
      replied:
        dbMessage.replying_to !== null
          ? await convertMessage(
              { ...dbMessage.replying_to, replying_to: null },
              userById
            )
          : undefined,
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
    replied:
      dbMessage.replying_to !== null
        ? await convertMessage(
            { ...dbMessage.replying_to, replying_to: null },
            userById
          )
        : undefined,
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
