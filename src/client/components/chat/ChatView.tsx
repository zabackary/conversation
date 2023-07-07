import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  Menu,
  MenuItem,
  SxProps,
  Tooltip,
} from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import syntaxHighlightingTheme from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark";
import Message from "../../../model/message";
import { SentMessageEvent } from "../../network/NetworkBackend";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import UserTooltip from "../UserTooltip";
import AsyncSyntaxHighlighter from "./AsyncSyntaxHighlighter";
import ChatInput from "./ChatInput";
import ChatList, { ChatListProps } from "./ChatList";
import ChatListSkeleton from "./ChatListSkeleton";

export interface ChatViewProps {
  messages?: Message[];
  onSend: (event: SentMessageEvent) => void;
  username?: string;
  channelName?: string;
  afterInput?: ReactNode;
  sx?: SxProps;
  topAlert?: ReactNode;
}

export default function ChatView({
  messages,
  onSend,
  username,
  channelName,
  sx,
  afterInput,
  topAlert,
}: ChatViewProps) {
  const [isSticky, setIsSticky] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation("channel");

  useEffect(() => {
    if (!inputRef.current || !containerRef.current) return undefined;
    const cachedRef = inputRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(!!e && e.intersectionRatio < 1),
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
        !!entry &&
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

  const [currentReply, setCurrentReply] = useState<number | null>(null);

  const messageAccents = (
    [] as NonNullable<ChatListProps["messageAccents"]>
  ).concat(
    contextMenu ? [{ id: contextMenu.message.id, accent: "tertiary" }] : [],
    currentReply ? [{ id: currentReply, accent: "secondary" }] : []
  );

  const handleReply = () => {
    if (!contextMenu) throw new Error("Illegal state");
    setCurrentReply(contextMenu.message.id);
    handleClose();
  };

  const handleCopyMessageId = () => {
    if (!contextMenu) throw new Error("Illegal state");
    void navigator.clipboard.writeText(String(contextMenu.message.id));
    handleClose();
  };

  const [currentMessageDetail, setCurrentMessageDetail] =
    useState<Message | null>(null);

  const handleMessageDetails = () => {
    if (!contextMenu) throw new Error("Illegal state");
    setCurrentMessageDetail(contextMenu.message);
    handleClose();
  };

  return (
    <Box sx={sx} ref={containerRef}>
      <Dialog
        open={!!currentMessageDetail}
        onClose={() => setCurrentMessageDetail(null)}
      >
        <DialogTitle>Message details</DialogTitle>
        {currentMessageDetail ? (
          <DialogContent>
            <DialogContentText>
              Sent at {currentMessageDetail.sent.toLocaleDateString()} by{" "}
              <Tooltip title={<UserTooltip user={currentMessageDetail.user} />}>
                <Box
                  component="span"
                  sx={{
                    borderBottom: "1px dotted transparent",
                    borderBottomColor: "divider",
                  }}
                >
                  {currentMessageDetail.user.name}
                </Box>
              </Tooltip>{" "}
              with {currentMessageDetail.attachments.length} attachments and{" "}
              {currentMessageDetail.images.length} images.
            </DialogContentText>
            <DialogContentText>Message source:</DialogContentText>
            <AsyncSyntaxHighlighter
              style={syntaxHighlightingTheme}
              language="markdown"
            >
              {currentMessageDetail.markdown}
            </AsyncSyntaxHighlighter>
            <DialogContentText>
              Message #{currentMessageDetail.id} in channel #
              {currentMessageDetail.parent}.
              {currentMessageDetail.replied !== undefined
                ? ` Replying to message #${currentMessageDetail.replied}.`
                : null}
            </DialogContentText>
          </DialogContent>
        ) : null}
        <DialogActions>
          <Button onClick={() => setCurrentMessageDetail(null)}>Done</Button>
        </DialogActions>
      </Dialog>
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
          <MenuItem onClick={handleCopyMessageId}>
            <ListItemIcon>
              <MaterialSymbolIcon icon="fingerprint" />
            </ListItemIcon>
            Copy message ID
          </MenuItem>
          <MenuItem onClick={handleReply}>
            <ListItemIcon>
              <MaterialSymbolIcon icon="reply" />
            </ListItemIcon>
            Reply
          </MenuItem>
          <MenuItem onClick={handleMessageDetails}>
            <ListItemIcon>
              <MaterialSymbolIcon icon="info" />
            </ListItemIcon>
            Message details
          </MenuItem>
          {/*
          <MenuItem>
            <ListItemIcon>
              <MaterialSymbolIcon icon="edit" />
            </ListItemIcon>
            Edit message
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <MaterialSymbolIcon icon="push_pin" />
            </ListItemIcon>
            Set as pinned message
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <MaterialSymbolIcon icon="share" />
            </ListItemIcon>
            Copy link to message
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <MaterialSymbolIcon icon="delete" />
            </ListItemIcon>
            Delete message
          </MenuItem>
        */}
        </Menu>
        {topAlert}
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
          setCurrentReply(null);
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
        currentReply={currentReply ?? undefined}
        onReplyClear={() => setCurrentReply(null)}
      />
      <Box
        sx={{
          marginBottom: {
            xs: 12,
            sm: afterInput ? 2 : 0,
          },
          mx: 1,
        }}
      >
        {afterInput}
      </Box>
    </Box>
  );
}
