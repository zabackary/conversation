import { Box, Fab, Fade, List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import MaterialSymbolIcon from "../../../components/MaterialSymbolIcon";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import useChannels from "../../../hooks/useChannels";
import useUser from "../../../hooks/useUser";

export default function ChannelListRoute() {
  const match = useMatches()[2];
  const currentOutlet = useOutlet();
  const channels = useChannels();
  const user = useUser();
  const { t } = useTranslation("channel");
  return (
    <ConversationNavigationDrawer
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={
        <>
          <Fab
            variant="extended"
            color="surface"
            sx={{ m: 2, mr: "auto" }}
            component={Link}
            to="join/"
          >
            <MaterialSymbolIcon icon="add" sx={{ mr: 1 }} />
            {t("joinButton")}
          </Fab>
          <List sx={{ mx: 1 }}>
            <ChannelList channels={channels} />
          </List>
        </>
      }
    >
      <SwitchTransition>
        <Fade key={match?.pathname} timeout={200} unmountOnExit>
          <Box>{currentOutlet}</Box>
        </Fade>
      </SwitchTransition>
    </ConversationNavigationDrawer>
  );
}
