import AddIcon from "@mui/icons-material/Add";
import { List } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import LinkListItem from "../../../components/main/LinkListItem";
import useChannels from "../../../hooks/useChannels";
import useUser from "../../../hooks/useUser";

export default function ChannelListRoute() {
  const channels = useChannels();
  const user = useUser();
  return (
    <ConversationNavigationDrawer
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={
        <List>
          <ChannelList channels={channels} />
          <LinkListItem
            primaryText="Join channel"
            to="/join"
            icon={<AddIcon />}
          />
        </List>
      }
    >
      <Outlet />
    </ConversationNavigationDrawer>
  );
}
