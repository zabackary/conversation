import { List, SxProps } from "@mui/material";
import Message from "../../../data/message";
import ChatItem from "./ChatItem";

interface Props {
  messages?: Message[] | null;
  sx?: SxProps;
}

export default function ChatList({ messages, sx }: Props) {
  return (
    <List sx={sx}>
      {messages
        ? messages.map((message, index) => (
            <ChatItem
              message={message}
              showAvatar={
                index === 0 || messages[index - 1].user.id !== message.user.id
              }
              key={message.id}
            />
          ))
        : null}
    </List>
  );
}
