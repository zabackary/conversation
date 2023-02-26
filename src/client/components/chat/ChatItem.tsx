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
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import {
  PluggableList,
  ReactMarkdownOptions,
} from "react-markdown/lib/react-markdown";
import TimeAgo from "react-timeago";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import Message from "../../../model/message";

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
  if (showAvatar) {
    return (
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemAvatar>
          <Avatar
            src={
              (message.isService
                ? message.user.icon
                : message.user.profilePicture) ?? undefined
            }
            alt={message.user.name}
          >
            {message.isService
              ? message.user.name[0]
              : message.user.nickname[0]}
          </Avatar>
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
            <NoPaddingReactMarkdown>{message.markdown}</NoPaddingReactMarkdown>
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
          <NoPaddingReactMarkdown>{message.markdown}</NoPaddingReactMarkdown>
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
