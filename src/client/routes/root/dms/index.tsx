import { Box, Fab, Fade, List } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import MaterialSymbolIcon from "../../../components/MaterialSymbolIcon";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import useSnackbar from "../../../components/useSnackbar";
import useDMs from "../../../hooks/useDMs";
import useUser from "../../../hooks/useUser";

export default function DmListRoute() {
  const match = useMatches()[2];
  const currentOutlet = useOutlet();
  const dms = useDMs();
  const user = useUser();
  const snackbar = useSnackbar();
  const [count, setCount] = useState(0);
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
            // component={Link}
            // to="join/"
            onClick={(e) => {
              e.preventDefault();
              snackbar.showSnackbar(`Can't join DMs yet: ${count}`);
              setCount((prev) => prev + 1);
            }}
          >
            <MaterialSymbolIcon icon="add" sx={{ mr: 1 }} />
            {t("joinDmButton")}
          </Fab>
          <List sx={{ mx: 1 }}>
            <ChannelList channels={dms} />
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
