import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import confetti from "canvas-confetti";
import { MouseEventHandler, useContext } from "react";
import { Link } from "react-router-dom";
import FeatureListItem from "../../components/landing/FeatureListItem";
import useSnackbar from "../../components/useSnackbar";
import { ThemeModeContext } from "../../theme";
import features from "./features";

const LargeButton = styled(Button)(({ theme }) => ({
  height: 68,
  borderRadius: 24,
  "&:hover, &:focus": {
    borderRadius: 16,
  },
  transition: theme.transitions.create([
    "border-radius",
    "background-color",
    "box-shadow",
  ]),
  fontSize: 18,
  padding: "9px 24px",
}));

export default function LandingRoute() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const theme = useTheme();
  const { toggleThemeMode } = useContext(ThemeModeContext);
  const { showSnackbar } = useSnackbar();
  const handleSendIconClick: MouseEventHandler = (event) => {
    void confetti({
      disableForReducedMotion: true,
      origin: {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      },
      particleCount: 200,
      startVelocity: 30,
      spread: 90,
    });
    showSnackbar("Nice job finding an easter egg!", { urgent: true });
  };
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 4 : 0}
        sx={{ bgcolor: trigger ? undefined : "inherit" }}
      >
        <Toolbar>
          <Typography variant="h5" component="span" sx={{ flexGrow: 1 }}>
            Conversation
          </Typography>
          <Fade in={trigger && !isMobile}>
            <Box sx={{ whiteSpace: "nowrap", width: isMobile ? 0 : undefined }}>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                component={Link}
                to="/login/"
              >
                Log in
              </Button>
              <Button
                variant="filled"
                component={Link}
                to="/login/new/"
                sx={{ mr: 1 }}
              >
                Get started
              </Button>
            </Box>
          </Fade>
          <IconButton onClick={toggleThemeMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeIcon />
            ) : (
              <LightModeIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" p={2}>
        <Toolbar />
        <Box
          component="header"
          p={4}
          borderRadius={8}
          bgcolor="primaryContainer.main"
          mb={4}
        >
          <Grid container>
            <Grid item xs textAlign={isMobile ? "center" : "left"}>
              <Typography variant={isMobile ? "h3" : "h1"} component="h1">
                Converse.
              </Typography>
              <Typography variant={isMobile ? "h5" : "h3"} component="h2">
                Easily communicate about essential academic projects.
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                disableRipple
                onClick={handleSendIconClick}
                sx={{ margin: "auto" }}
              >
                <SendIcon
                  sx={{ width: "100%", height: "100%" }}
                  color="secondary"
                />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <LargeButton variant="filled" sx={{ mr: 2 }}>
                Get started
              </LargeButton>
              <LargeButton>Log in</LargeButton>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="h4" component="h2" textAlign="center">
          Why Conversation?
        </Typography>
        <Grid container spacing={2} my={2}>
          {features.map((feature) => (
            <FeatureListItem feature={feature} key={feature.name} />
          ))}
        </Grid>
        <Divider />
        <Typography variant="body1" textAlign="center" p={2}>
          Designed by Zachary in 2023. Reach out to report a problem, request a
          feature, or get in touch.
        </Typography>
      </Box>
    </>
  );
}
