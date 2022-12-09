import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Avatar,
  Badge,
  BadgeProps,
  Card,
  CardHeader,
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
import Message, {
  ServiceMessageBuiltInIcon,
  ServiceMessageFormat,
} from "../../../data/message";

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
export const InlineBadge = styled(Badge)<BadgeProps>(({ theme: _theme }) => ({
  position: "unset",
  "& .MuiBadge-badge": {
    position: "unset",
    transform: "unset",
  },
}));

const iconMap = {
  [ServiceMessageBuiltInIcon.Flag]: FlagIcon,
  [ServiceMessageBuiltInIcon.PersonAdd]: PersonAddIcon,
  [ServiceMessageBuiltInIcon.Edit]: EditIcon,
};

interface Props {
  message: Message;
  showAvatar?: boolean;
}

export default function ChatItem({ message, showAvatar }: Props) {
  if (message.isService) {
    if (message.format === ServiceMessageFormat.Card) {
      let icon;
      if (typeof message.icon === "string") {
        icon = <Avatar src={message.icon} />;
      } else if (message.icon !== undefined) {
        const BuiltInIcon = iconMap[message.icon];
        icon = <BuiltInIcon fontSize="large" />;
      } else {
        icon = null;
      }
      return (
        <ListItem alignItems="flex-start" disablePadding>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardHeader
              avatar={icon}
              title={<b>{message.title}</b>}
              subheader={
                <NoPaddingReactMarkdown>
                  {message.subheader ?? ""}
                </NoPaddingReactMarkdown>
              }
            />
          </Card>
        </ListItem>
      );
    }
    if (message.format === ServiceMessageFormat.Caption) {
      return (
        <ListItem alignItems="flex-start" disablePadding>
          <ListItemText
            secondary={message.title}
            secondaryTypographyProps={{
              textAlign: "center",
              fontStyle: "italic",
              fontSize: "0.8rem",
            }}
          />
        </ListItem>
      );
    }
    return (
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemAvatar>
          <Avatar src={message.user.icon} alt={message.user.name} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              {message.user.name}{" "}
              <InlineBadge badgeContent="bot" color="primary" />{" "}
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
            <NoPaddingReactMarkdown>{message.title}</NoPaddingReactMarkdown>
          }
          secondaryTypographyProps={{
            component: "div",
            sx: { wordBreak: "break-word" },
          }}
        />
      </ListItem>
    );
  }
  if (showAvatar) {
    return (
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemAvatar>
          <Avatar
            src={message.user.profilePicture ?? undefined}
            alt={message.user.name}
          >
            {message.user.nickname[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              {message.user.nickname}{" "}
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
