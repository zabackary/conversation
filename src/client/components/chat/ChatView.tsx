import { Box, SxProps } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import Message from "../../../model/message";
import { SentMessageEvent } from "../../network/network_definitions";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatListSkeleton from "./ChatListSkeleton";

export interface ChatViewProps {
  messages?: Message[];
  onSend: (event: SentMessageEvent) => void;
  username?: string;
  channelName?: string;
  afterInput?: ReactNode;
  sx?: SxProps;
}

export default function ChatView({
  messages,
  onSend,
  username,
  channelName,
  sx,
  afterInput,
}: ChatViewProps) {
  const [isSticky, setIsSticky] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!inputRef.current || !containerRef.current) return undefined;
    const cachedRef = inputRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      {
        rootMargin: "0px 0px -1px 0px",
        threshold: 1,
        root: containerRef.current,
      }
    );

    observer.observe(cachedRef);

    return () => {
      observer.unobserve(cachedRef);
    };
  }, [inputRef, containerRef]);

  return (
    <Box sx={sx} ref={containerRef}>
      {messages ? (
        <ChatList
          messages={messages}
          sx={{
            pb: {
              xs: "104px",
              sm: "24px",
            },
          }}
        />
      ) : (
        <ChatListSkeleton
          sx={{
            pb: {
              xs: "104px",
              sm: "24px",
            },
          }}
        />
      )}
      <ChatInput
        onMessageSend={(event) => {
          onSend(event);
        }}
        sx={{
          position: "sticky",
          bottom: {
            xs: "104px",
            sm: "24px",
          },
          marginBottom: afterInput ? "12px" : "0px",
        }}
        placeholder={
          channelName && username
            ? `Message ${channelName} as ${username}...`
            : ""
        }
        elevate={!isSticky}
        ref={inputRef}
      />
      {afterInput}
    </Box>
  );
}
