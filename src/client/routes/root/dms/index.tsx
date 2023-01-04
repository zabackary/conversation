import AddIcon from "@mui/icons-material/Add";
import { Fab, List } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import useDMs from "../../../hooks/useDMs";
import useUser from "../../../hooks/useUser";

export default function DmListRoute() {
  const dms = useDMs();
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
            New DM
          </Fab>
          <ChannelList channels={dms} />
        </List>
      }
    >
      <Outlet />
    </ConversationNavigationDrawer>
  );
}
