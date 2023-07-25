import {
  Badge,
  BadgeProps,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import TimeAgo from "react-timeago";
import Message from "../../../model/message";
import { PrivilegeLevel } from "../../../model/user";
import useUserActivity from "../../hooks/useUserActivity";
import { ContrastBadge } from "../main/DrawerHeader";
import ProfilePicture from "../ProfilePicture";
import UserTooltip from "../UserTooltip";
import MaterialReactMarkdown from "./MaterialReactMarkdown";
import ReplyPreview from "./ReplyPreview";

const WHITELISTED_TRANSLATIONS = [
  "dmStart",
  "chatStart",
  "chatMemberAdd",
  "chatNameChange",
  "easteregg", // hehehe
];
const TRANSLATION_MARKER = "!translation:";

export const InlineBadge = styled(Badge)<BadgeProps>(() => ({
  position: "unset",
  "& .MuiBadge-badge": {
    position: "unset",
    transform: "unset",
  },
}));

export interface ChatItemProps {
  message: Message;
  showAvatar?: boolean;
  onContextMenu?: (x: number, y: number, message: Message) => void;
  decoration?: "primary" | "secondary" | "tertiary";
}

const ChatItem = memo(
  ({ message, showAvatar, onContextMenu, decoration }: ChatItemProps) => {
    const { t } = useTranslation("message");
    const translatedMarkdown = useMemo(() => {
      if (!message.markdown.startsWith(TRANSLATION_MARKER))
        return message.markdown;
      const split = message.markdown
        .slice(TRANSLATION_MARKER.length)
        .split(":");
      if (!split[0]) {
        console.warn("Invalid translation sequence:", split);
        return message.markdown;
      }
      if (WHITELISTED_TRANSLATIONS.includes(split[0])) {
        return t(split[0], Object(split.slice(1)));
      }
      return message.markdown;
    }, [message.markdown, t]);
    const active = useUserActivity(message.user.id);
    return (
      <ListItem
        disablePadding
        disableGutters
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.call(undefined, e.clientX, e.clientY, message);
        }}
        sx={{ position: "relative" }}
      >
        <ListItemButton
          sx={{
            mx: "8px",
            borderRadius: "8px",
            "--mui-button-base-focus-ring-radius": "8px",
            p: "0 16px !important",
            pl: decoration ? "13px !important" : undefined,
            bgcolor: decoration ? `${decoration}Container.main` : undefined,
            borderLeft: decoration ? "3px solid transparent" : undefined,
            borderLeftColor: decoration ? `${decoration}.main` : undefined,
            flexDirection: "column",
          }}
          alignItems="flex-start"
        >
          {message.replied ? (
            <ReplyPreview
              id={message.replied}
              inline
              sx={{ flexGrow: 1, width: "100%", px: 1, pt: 1 }}
            />
          ) : null}
          <Box display="flex" alignItems="flex-start" width="100%">
            {showAvatar ? (
              <ListItemAvatar>
                <ContrastBadge
                  color="success"
                  variant="dot"
                  sx={{ marginRight: "8px" }}
                  overlap="circular"
                  invisible={!active}
                >
                  <Tooltip
                    title={<UserTooltip user={message.user} />}
                    placement="left"
                  >
                    <ProfilePicture user={message.user} />
                  </Tooltip>
                </ContrastBadge>
              </ListItemAvatar>
            ) : null}
            <ListItemText
              primary={
                showAvatar ? (
                  <>
                    {message.isService
                      ? message.user.name
                      : message.user.nickname}
                    <Stack
                      spacing={0.5}
                      mx={0.5}
                      direction="row"
                      component="span"
                      display="inline-flex"
                    >
                      {message.isService ? (
                        <InlineBadge color="primary" badgeContent="bot" />
                      ) : null}
                      {message.user.privilegeLevel === PrivilegeLevel.ADMIN ? (
                        <InlineBadge color="secondary" badgeContent="Admin" />
                      ) : null}
                      {message.user.privilegeLevel ===
                      PrivilegeLevel.UNVERIFIED ? (
                        <InlineBadge
                          color="warning"
                          badgeContent="Unverified"
                        />
                      ) : null}
                      {message.user.disabled ? (
                        <InlineBadge color="error" badgeContent="Disabled" />
                      ) : null}
                    </Stack>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ opacity: 0.5 }}
                    >
                      <TimeAgo date={message.sent} />
                    </Typography>
                  </>
                ) : null
              }
              secondary={
                <MaterialReactMarkdown sx={{ overflow: "hidden" }} inline>
                  {translatedMarkdown as string}
                </MaterialReactMarkdown>
              }
              secondaryTypographyProps={{
                component: "div",
                sx: { wordBreak: "break-word" },
              }}
              inset={!showAvatar}
            />
          </Box>
        </ListItemButton>
      </ListItem>
    );
  }
);
export default ChatItem;
