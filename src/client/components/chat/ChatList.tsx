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
        ? messages.map((message) => (
            <ChatItem message={message} key={message.id} />
          ))
        : null}
    </List>
  );
}
