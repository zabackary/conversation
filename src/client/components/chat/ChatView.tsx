import { Box, ListItemIcon, Menu, MenuItem, SxProps } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import PushPinIcon from "@mui/icons-material/PushPin";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatListSkeleton from "./ChatListSkeleton";
import ChatList, { ChatListProps } from "./ChatList";
import ChatInput from "./ChatInput";
import { SentMessageEvent } from "../../network/NetworkBackend";
import Message from "../../../model/message";

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

  const oldMessagesRef = useRef<Message[] | undefined>(undefined);

  useEffect(() => {
    const oldMessages = oldMessagesRef.current;
    if (messages && oldMessages === undefined) {
      window.scrollTo({
        top: document.body.scrollHeight - document.body.offsetHeight + 1,
        behavior: "auto", // Jerky
      });
      oldMessagesRef.current = messages;
    } else if (messages && oldMessages && isSticky) {
      window.scrollTo({
        top: document.body.scrollHeight - document.body.offsetHeight + 1,
        behavior: "smooth",
      });
      oldMessagesRef.current = messages;
    }
  }, [messages, oldMessagesRef, isSticky]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const { current } = containerRef;
    let oldEntry: undefined | ResizeObserverEntry;
    const observer = new ResizeObserver(([entry]) => {
      if (
        oldEntry &&
        isSticky &&
        entry.contentRect.width < oldEntry.contentRect.width
      ) {
        window.scrollTo({
          top: document.body.scrollHeight - document.body.offsetHeight + 1,
          behavior: "auto", // Jerky
        });
      }
      oldEntry = entry;
    });
    if (current) observer.observe(current);
    return () => {
      observer.disconnect();
    };
  }, [containerRef, isSticky]);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    message: Message;
  } | null>(null);

  const handleContextMenu = (x: number, y: number, message: Message) => {
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: x + 2,
            mouseY: y - 6,
            message,
          }
        : null
    );
  };

  const handleClose = (e?: unknown) => {
    setContextMenu(null);
    if (
      typeof e === "object" &&
      e &&
      "preventDefault" in e &&
      typeof e.preventDefault === "function"
    )
      e.preventDefault();
  };

  const messageAccents = (
    [] as NonNullable<ChatListProps["messageAccents"]>
  ).concat(
    contextMenu ? [{ id: contextMenu.message.id, accent: "tertiary" }] : []
  );

  return (
    <Box sx={sx} ref={containerRef}>
      <Box onContextMenu={handleClose}>
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? {
                  top: contextMenu.mouseY,
                  left: contextMenu.mouseX,
                }
              : undefined
          }
        >
          <MenuItem>
            <ListItemIcon>
              <FingerprintIcon fontSize="small" />
            </ListItemIcon>
            Copy message ID
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <ReplyIcon fontSize="small" />
            </ListItemIcon>
            Reply
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit message
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <PushPinIcon fontSize="small" />
            </ListItemIcon>
            Set as pinned message
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            Copy link to message
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete message
          </MenuItem>
        </Menu>
        {messages ? (
          <ChatList
            messages={messages}
            sx={{
              pb: 2,
            }}
            onContextMenu={handleContextMenu}
            messageAccents={messageAccents}
          />
        ) : (
          <ChatListSkeleton
            sx={{
              pb: 2,
            }}
          />
        )}
      </Box>
      <ChatInput
        onMessageSend={(event) => {
          onSend(event);
        }}
        sx={{
          position: "sticky",
          bottom: {
            xs: "80px",
            sm: 0,
          },
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
      <Box
        sx={{
          marginBottom: {
            xs: 12,
            sm: 0,
          },
          mx: 1,
        }}
      >
        {afterInput}
      </Box>
    </Box>
  );
}
