import AddIcon from "@mui/icons-material/Add";
import { Fab, Fade, List } from "@mui/material";
import { useState } from "react";
import { useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import useSnackbar from "../../../components/useSnackbar";
import useDMs from "../../../hooks/useDMs";
import useUser from "../../../hooks/useUser";

export default function DmListRoute() {
  const match = useMatches()[2] as ReturnType<typeof useMatches>[2] | undefined;
  const currentOutlet = useOutlet();
  const dms = useDMs();
  const user = useUser();
  const snackbar = useSnackbar();
  const [count, setCount] = useState(0);
  return (
    <ConversationNavigationDrawer
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={
        <List>
          <Fab
            variant="extended"
            color="primary"
            sx={{ m: 2 }}
            // component={Link}
            // to="join/"
            onClick={(e) => {
              e.preventDefault();
              snackbar.showSnackbar(`Can't join DMs yet: ${count}`);
              setCount((prev) => prev + 1);
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            New DM
          </Fab>
          <ChannelList channels={dms} />
        </List>
      }
    >
      <SwitchTransition>
        <Fade key={match?.pathname} timeout={200} unmountOnExit>
          <div>{currentOutlet}</div>
        </Fade>
      </SwitchTransition>
    </ConversationNavigationDrawer>
  );
}
