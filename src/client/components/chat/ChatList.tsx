import { List, SxProps } from "@mui/material";
import Message from "../../../model/message";
import ChatItem from "./ChatItem";

const COMBINE_MESSAGES_THRESHOLD = 60000;

interface Props {
  messages: Message[];
  sx?: SxProps;
}

export default function ChatList({ messages, sx }: Props) {
  return (
    <List sx={sx}>
      {messages.map((message, index) => {
        const lastMessage = messages[index - 1];
        return (
          <ChatItem
            message={message}
            showAvatar={
              index === 0 || lastMessage.isService || message.isService
                ? true
                : lastMessage.user.id !== message.user.id ||
                  message.sent.getTime() - lastMessage.sent.getTime() >
                    COMBINE_MESSAGES_THRESHOLD
            }
          />
        );
      })}
    </List>
  );
}
