import {
  Avatar,
  Badge,
  BadgeProps,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import {
  PluggableList,
  ReactMarkdownOptions,
} from "react-markdown/lib/react-markdown";
import TimeAgo from "react-timeago";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import Message from "../../../model/message";
import useUserActivity from "../../hooks/useUserActivity";
import { ContrastBadge } from "../main/DrawerHeader";

const WHITELISTED_TRANSLATIONS = [
  "dm_start",
  "chat_start",
  "chat_member_add",
  "chat_name_change",
  "easteregg",
];
const TRANSLATION_MARKER = "!translation:";

function NoPaddingReactMarkdown(props: ReactMarkdownOptions) {
  const plugins: PluggableList = [remarkGfm, remarkBreaks];
  return (
    <ReactMarkdown
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      components={{ p: Fragment }}
      rehypePlugins={plugins}
    />
  );
}
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
  if (showAvatar) {
    return (
      <ListItem alignItems="flex-start" disablePadding>
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
        <ListItemText
          primary={
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
          }
          secondary={
            <NoPaddingReactMarkdown>
              {translatedMarkdown}
            </NoPaddingReactMarkdown>
          }
          secondaryTypographyProps={{
            component: "div",
            sx: { wordBreak: "break-word" },
          }}
        />
      </ListItem>
    );
  }
  return (
    <ListItem alignItems="flex-start" disablePadding>
      <ListItemText
        secondary={
          <NoPaddingReactMarkdown>{translatedMarkdown}</NoPaddingReactMarkdown>
        }
        secondaryTypographyProps={{
          component: "div",
          sx: { wordBreak: "break-word" },
        }}
        inset
      />
    </ListItem>
  );
}
