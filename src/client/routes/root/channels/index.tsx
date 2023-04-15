import AddIcon from "@mui/icons-material/Add";
import { Fab, Fade, List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import useChannels from "../../../hooks/useChannels";
import useUser from "../../../hooks/useUser";

export default function ChannelListRoute() {
  const match = useMatches()[2] as ReturnType<typeof useMatches>[2] | undefined;
  const currentOutlet = useOutlet();
  const channels = useChannels();
  const user = useUser();
  const { t } = useTranslation("channel");
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
            {t("joinButton")}
          </Fab>
          <ChannelList channels={channels} />
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
