import {
  Avatar,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  Link,
  List,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useMatches,
  useOutlet,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";
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
import useUser from "../../hooks/useUser";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";

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
  const user = useUser(true);
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
  const navigate = useNavigate();
  const handleSwitchAccount = () => {
    backend
      .authLogOut()
      .then(() => {
        navigate("/login/");
      })
      .catch(() => {
        showSnackbar("Failed to log out");
      });
  };
  if (user?.disabled)
    return (
      <Container component="main" maxWidth="xs" sx={{ pt: 6, pb: 8 }}>
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "error.main",
              height: 76,
              width: 76,
              fontSize: 48,
            }}
          >
            &#128557;
          </Avatar>
          <Typography component="h1" variant="h5" mb={1}>
            Your account has been disabled
          </Typography>
          <Typography variant="body1" mb={1}>
            Something went awry. It seems your account has been disabled. If you
            believe this to be in error, please{" "}
            <Link href="mailto:TODO@example.com" target="_blank">
              contact us
            </Link>{" "}
            to get it fixed as soon as possible.
          </Typography>
          <Typography variant="body2" mb={1}>
            Repeat offenders&apos; accounts may be deleted permanently from our
            databases without prior notice. Remember to abide by our Terms of
            Service at all times while using Conversation.
          </Typography>
          <Typography variant="body2">
            Conversation utilizes automatic spam-prevention technologies to
            avoid spam. Your account may have been disabled in error by
            automated processes to avoid{" "}
            <Link
              href="https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/"
              target="_blank"
            >
              DDoS
            </Link>
            . It can be re-enabled by administrators.
          </Typography>
          <Grid container width="100%" textAlign="left">
            <Grid item xs>
              <Button
                component={RouterLink}
                to="/"
                variant="filled"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<MaterialSymbolIcon icon="arrow_back" />}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="tonal"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSwitchAccount}
              >
                Switch account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
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
