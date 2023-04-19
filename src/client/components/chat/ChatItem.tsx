import {
  Avatar,
  Badge,
  BadgeProps,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TimeAgo from "react-timeago";
import Message from "../../../model/message";
import useUserActivity from "../../hooks/useUserActivity";
import { ContrastBadge } from "../main/DrawerHeader";
import MaterialReactMarkdown from "./MaterialReactMarkdown";

const WHITELISTED_TRANSLATIONS = [
  "dm_start",
  "chat_start",
  "chat_member_add",
  "chat_name_change",
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

interface Props {
  message: Message;
  showAvatar?: boolean;
}

export default function ChatItem({ message, showAvatar }: Props) {
  const { t } = useTranslation("message");
  const translatedMarkdown = useMemo(() => {
    if (!message.markdown.startsWith(TRANSLATION_MARKER))
      return message.markdown;
    const split = message.markdown.slice(TRANSLATION_MARKER.length).split(":");
    if (WHITELISTED_TRANSLATIONS.includes(split[0])) {
      return t(split[0], Object(split.slice(1)));
    }
    return message.markdown;
  }, [message.markdown, t]);
  const active = useUserActivity(message.user.id);
  return (
    <ListItem disablePadding disableGutters>
      <ListItemButton sx={{ p: "0 24px !important" }} alignItems="flex-start">
        {showAvatar ? (
          <ListItemAvatar>
            <ContrastBadge
              color="success"
              variant="dot"
              sx={{ marginRight: "8px" }}
              overlap="circular"
              invisible={!active}
            >
              <Avatar
                src={message.user.profilePicture ?? undefined}
                alt={message.user.name}
              >
                {(message.user.nickname ?? message.user.name)[0]}
              </Avatar>
            </ContrastBadge>
          </ListItemAvatar>
        ) : null}
        <ListItemText
          primary={
            showAvatar ? (
              <>
                {message.isService ? message.user.name : message.user.nickname}{" "}
                {message.isService ? (
                  <InlineBadge color="primary" badgeContent="bot" />
                ) : null}{" "}
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
              {translatedMarkdown}
            </MaterialReactMarkdown>
          }
          secondaryTypographyProps={{
            component: "div",
            sx: { wordBreak: "break-word" },
          }}
          inset={!showAvatar}
        />
      </ListItemButton>
    </ListItem>
  );
}
