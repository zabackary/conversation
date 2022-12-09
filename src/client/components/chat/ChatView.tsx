import { Box, SxProps } from "@mui/material";
import Message from "../../../data/message";
import ChatInput, { MessageEvent } from "./ChatInput";
import ChatList from "./ChatList";
import ChatListSkeleton from "./ChatListSkeleton";

export interface ChatViewProps {
  messages?: Message[];
  onSend: (event: MessageEvent) => void;
  username?: string;
  channelName?: string;
  sx?: SxProps;
}

export default function ChatView({
  messages,
  onSend,
  username,
  channelName,
  sx,
}: ChatViewProps) {
  return (
    <Box sx={sx}>
      {messages ? <ChatList messages={messages} /> : <ChatListSkeleton />}
      <ChatInput
        onMessageSend={(event) => {
          onSend(event);
        }}
        sx={{
          position: "sticky",
          bottom: "24px",
        }}
        placeholder={
          channelName && username
            ? `Message ${channelName} as ${username}...`
            : ""
        }
      />
    </Box>
  );
}
