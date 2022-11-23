import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Message from "../../../data/message";

interface Props {
  message: Message;
}

export default function ChatItem({ message }: Props) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={message.user.profilePicture} alt={message.user.name} />
      </ListItemAvatar>
      <ListItemText
        primary={message.user.nickname}
        secondary={message.markdown}
      />
    </ListItem>
  );
}
