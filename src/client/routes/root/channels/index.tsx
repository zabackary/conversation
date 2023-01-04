import AddIcon from "@mui/icons-material/Add";
import { Fab, List } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
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
          <Fab
            variant="extended"
            color="primary"
            sx={{ m: 2 }}
            component={Link}
            to="join/"
          >
            <AddIcon sx={{ mr: 1 }} />
            Join channel
          </Fab>
          <ChannelList channels={channels} />
        </List>
      }
    >
      <Outlet />
    </ConversationNavigationDrawer>
  );
}
