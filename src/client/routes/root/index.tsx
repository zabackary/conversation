import {
  Box,
  Fade,
  List,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import {
  ConversationNavigationRail,
  navigationRailWidth,
} from "../../components/layout";
import { drawerWidth } from "../../components/layout/ConversationNavigationDrawer";
import LinkListItem from "../../components/main/LinkListItem";
import useSnackbar from "../../components/useSnackbar";
import useBackend from "../../hooks/useBackend";
import useRouteForward from "../../hooks/useRouteForward";
import { useSubscribable } from "../../hooks/useBackendFunction";
import useRequireLogin from "../../hooks/useRequireLogin";

function LoadingGlimmer() {
  return (
    <Stack direction="row" height="100%">
      <Paper elevation={3} sx={{ height: "100%", width: "88px" }} />
      <List sx={{ width: drawerWidth, mt: 24 }}>
        <>
          {Array<undefined>(3)
            .fill(undefined)
            .map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <LinkListItem loading key={index} />
            ))}
        </>
      </List>
    </Stack>
  );
}

export default function RootRoute() {
  useRouteForward();
  useRequireLogin();
  const match = useMatches()[1] as ReturnType<typeof useMatches>[2] | undefined;
  const currentOutlet = useOutlet();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const backend = useBackend();
  const [isReady, setIsReady] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  useEffect(() => {
    if (backend.isReady) {
      backend.isReady
        .then(() => {
          setIsReady(true);
        })
        .catch((err) => {
          console.error("Backend failed to initialize.", err);
          showSnackbar(t("error"), {
            autoHide: false,
          });
        });
    } else {
      console.log(backend);
      setIsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This is a fire-and-forget effect.
  }, []);
  const connectionState = useSubscribable(() => backend.connectionState);
  useEffect(() => {
    if (connectionState instanceof Error) {
      return;
    }
    let message: string | null;
    switch (connectionState) {
      case "connected":
      case null:
        message = "Connected.";
        break;
      case "connecting":
        message = "Connecting...";
        break;
      case "error":
        message = "Connection error. Reload to try again.";
        break;
      case "reconnecting":
        message = "Disconnected. Reconnecting...";
        break;
    }
    if (message) {
      showSnackbar(message, {
        autoHide: connectionState === "connected",
        urgent: true,
        autoHideDuration: 1000,
      });
    }
  }, [connectionState, showSnackbar]);
  return isReady ? (
    <Stack direction={isMobile ? "column" : "row"} height="100%">
      <Box width={navigationRailWidth}>
        <ConversationNavigationRail mobile={isMobile} />
      </Box>
      <SwitchTransition>
        <Fade key={match?.id} timeout={200} unmountOnExit>
          <Stack
            direction={isMobile ? "column" : "row"}
            height="100%"
            width={
              isMobile ? undefined : `calc(100% - ${navigationRailWidth}px)`
            }
          >
            {currentOutlet}
          </Stack>
        </Fade>
      </SwitchTransition>
    </Stack>
  ) : (
    <LoadingGlimmer />
  );
}
