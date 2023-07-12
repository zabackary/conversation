import { List, SxProps } from "@mui/material";
import { memo } from "react";
import Message from "../../../model/message";
import ChatItem, { ChatItemProps } from "./ChatItem";

/**
 * Time period in ms in which to combine messages by the same user.
 */
const COMBINE_MESSAGES_THRESHOLD = 60000;

export interface ChatListProps {
  messages: Message[];
  sx?: SxProps;
  onContextMenu?: (x: number, y: number, message: Message) => void;
  messageAccents?: {
    accent: NonNullable<ChatItemProps["decoration"]>;
    id: number;
  }[];
}

const ChatList = memo(
  ({ messages, sx, onContextMenu, messageAccents }: ChatListProps) => {
    return (
      <List sx={sx}>
        {messages.map((message, index) => {
          const lastMessage = messages[index - 1];
          return (
            <ChatItem
              message={message}
              key={message.id}
              showAvatar={
                index === 0 ||
                lastMessage?.isService ||
                message.isService ||
                message.replied !== undefined ||
                lastMessage?.user.id !== message.user.id ||
                message.sent.getTime() - lastMessage.sent.getTime() >
                  COMBINE_MESSAGES_THRESHOLD
              }
              onContextMenu={onContextMenu}
              decoration={
                messageAccents?.find((accent) => accent.id === message.id)
                  ?.accent
              }
            />
          );
        })}
      </List>
    );
  }
);
export default ChatList;
