import { Box, SxProps } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Message from "../../../model/message";
import { SentMessageEvent } from "../../network/NetworkBackend";
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
  const { t } = useTranslation("channel");

  useEffect(() => {
    if (!inputRef.current || !containerRef.current) return undefined;
    const cachedRef = inputRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      {
        rootMargin: "0px 0px -25px 0px",
        threshold: 1,
        root: containerRef.current,
      }
    );

    observer.observe(cachedRef);

    return () => {
      observer.unobserve(cachedRef);
    };
  }, [inputRef, containerRef]);

  const oldStickyState = useRef<number | undefined>(messages?.length);
  useEffect(() => {
    if (messages?.length !== oldStickyState.current && isSticky) {
      oldStickyState.current = messages?.length;
      let height = containerRef.current?.offsetHeight;
      let hasChanged = false;
      const scrollBottom = () => {
        window.scrollBy(0, Number.MAX_SAFE_INTEGER);
        const heightChanged = height !== containerRef.current?.offsetHeight;
        if (!hasChanged || heightChanged) {
          window.requestAnimationFrame(scrollBottom);
          height = containerRef.current?.offsetHeight;
          if (heightChanged) hasChanged = true;
        } else {
          setTimeout(() => window.scrollBy(0, Number.MAX_SAFE_INTEGER), 10);
        }
      };
      scrollBottom();
    }
  }, [oldStickyState, containerRef, isSticky, messages?.length]);

  return (
    <Box sx={sx} ref={containerRef}>
      {messages ? (
        <ChatList
          messages={messages}
          sx={{
            pb: {
              xs: "112px",
              sm: "32px",
            },
          }}
        />
      ) : (
        <ChatListSkeleton
          sx={{
            pb: {
              xs: "112px",
              sm: "32px",
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
            ? t("prompt", {
                channelOrUsername: channelName,
                currentUser: username,
              })
            : ""
        }
        elevate={!isSticky}
        ref={inputRef}
      />
      {afterInput}
    </Box>
  );
}
