import { List } from "@mui/material";
import Message from "../../../data/message";
import ChatItem from "./ChatItem";

interface Props {
  messages?: Message[] | null;
}

export default function ChatList({ messages }: Props) {
  return (
    <List>
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
