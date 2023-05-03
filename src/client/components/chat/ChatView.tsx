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
import ChatList from "./ChatList";
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

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (x: number, y: number, _message: Message) => {
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: x + 2,
            mouseY: y - 6,
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

  return (
    <Box sx={sx} ref={containerRef} onContextMenu={handleClose}>
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
            pb: {
              xs: "112px",
              sm: "32px",
            },
          }}
          onContextMenu={handleContextMenu}
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
