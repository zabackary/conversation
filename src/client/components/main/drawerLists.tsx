import AddIcon from "@mui/icons-material/Add";
import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import { List, ListSubheader } from "@mui/material";
import { useId } from "react";
import Channel from "../../../model/channel";
import ChannelList from "./ChannelList";
import LinkListItem from "./LinkListItem";

interface Props {
  channels?: Channel[] | null;
}

export default function DrawerLists(props: Props) {
  const { channels } = props;
  const channelListId = useId();
  const settingsListId = useId();

  return (
    <>
      <List>
        <LinkListItem
          primaryText="Home"
          secondaryText="From Alice, Bob, Joe, Eve, and more"
          to="/"
          badge={8}
          icon={<ForumIcon />}
        />
      </List>
      <List
        aria-labelledby={channelListId}
        subheader={
          <ListSubheader component="div" id={channelListId}>
            Channels
          </ListSubheader>
        }
      >
        <ChannelList channels={channels} />
        <LinkListItem
          primaryText="Join channel"
          to="/join"
          icon={<AddIcon />}
        />
      </List>
      <List
        aria-labelledby={settingsListId}
        subheader={
          <ListSubheader component="div" id={settingsListId}>
            Settings
          </ListSubheader>
        }
      >
        <LinkListItem
          primaryText="Manage channels"
          to="/settings/channels"
          icon={<SortIcon />}
        />
        <LinkListItem
          primaryText="Settings"
          to="/settings"
          icon={<SettingsIcon />}
        />
      </List>
    </>
  );
}
