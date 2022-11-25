import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import {
  PluggableList,
  ReactMarkdownOptions,
} from "react-markdown/lib/react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import Message from "../../../data/message";

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

interface Props {
  message: Message;
  showAvatar: boolean;
}

export default function ChatItem({ message, showAvatar }: Props) {
  return showAvatar ? (
    <ListItem alignItems="flex-start" disablePadding>
      <ListItemAvatar>
        <Avatar src={message.user.profilePicture} alt={message.user.name} />
      </ListItemAvatar>
      <ListItemText
        primary={message.user.nickname}
        secondary={
          <NoPaddingReactMarkdown>{message.markdown}</NoPaddingReactMarkdown>
        }
        secondaryTypographyProps={{ component: "div" }}
      />
    </ListItem>
  ) : (
    <ListItem alignItems="flex-start" disablePadding>
      <ListItemText
        secondary={
          <NoPaddingReactMarkdown>{message.markdown}</NoPaddingReactMarkdown>
        }
        secondaryTypographyProps={{ component: "div" }}
        inset
      />
    </ListItem>
  );
}
