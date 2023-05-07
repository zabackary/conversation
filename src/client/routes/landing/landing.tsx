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
import { MouseEventHandler, useContext, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import FeatureListItem from "../../components/landing/FeatureListItem";
import LanguagePickerDialog from "../../components/layout/LanguagePickerDialog";
import useSnackbar from "../../components/useSnackbar";
import useUser from "../../hooks/useUser";
import { ThemeModeContext } from "../../theme";
import getFeaturesList from "./features";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";

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
    // UNTRANSLATED
    showSnackbar("Nice job finding an easter egg!", { urgent: true });
  };
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const user = useUser(false);
  const { i18n, t } = useTranslation("landing");
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const handleLanguagePickerClose = (language: string | undefined) => {
    setLanguagePickerOpen(false);
    if (language) void i18n.changeLanguage(language);
  };
  const handleLanguagePickerOpen = () => {
    setLanguagePickerOpen(true);
  };
  const features = useMemo(() => getFeaturesList(t), [t]);
  return (
    <>
      <LanguagePickerDialog
        open={languagePickerOpen}
        onClose={handleLanguagePickerClose}
      />
      <AppBar
        position="fixed"
        elevation={trigger ? 4 : 0}
        sx={{ bgcolor: trigger ? undefined : "inherit" }}
      >
        <Toolbar>
          <Typography variant="h5" component="span" sx={{ flexGrow: 1 }}>
            [untranslated] Conversation
          </Typography>
          <Fade in={trigger && !isMobile}>
            <Box sx={{ whiteSpace: "nowrap", width: isMobile ? 0 : undefined }}>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                component={Link}
                to="/app/"
              >
                {t("header.buttons.launch")}
              </Button>
              <Button
                variant="filled"
                component={Link}
                to="/login/new/"
                sx={{ mr: 1 }}
              >
                {t("header.buttons.createAcc")}
              </Button>
            </Box>
          </Fade>
          <IconButton onClick={toggleThemeMode}>
            {theme.palette.mode === "dark" ? (
              <MaterialSymbolIcon icon="dark_mode" />
            ) : (
              <MaterialSymbolIcon icon="light_mode" />
            )}
          </IconButton>
          <IconButton onClick={handleLanguagePickerOpen}>
            <MaterialSymbolIcon icon="translate" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" p={2}>
        <Toolbar />
        <Box
          component="header"
          p={4}
          pb={2}
          borderRadius={8}
          bgcolor="primaryContainer.main"
          mb={4}
        >
          <Grid container rowSpacing={2}>
            <Grid item xs textAlign={isMobile ? "center" : "left"}>
              <Typography variant="h1">{t("header.title")}</Typography>
              <Typography variant="h2">{t("header.subtitle")}</Typography>
            </Grid>
            <Grid item>
              <IconButton
                disableRipple
                onClick={handleSendIconClick}
                sx={{
                  margin: "auto",
                }}
              >
                <MaterialSymbolIcon size={256} icon="send" color="secondary" />
              </IconButton>
            </Grid>
            <Grid item xs={12} textAlign="center">
              {user ? t("header.alreadyLoggedIn") : null}
              <LargeButton
                variant="filled"
                sx={{
                  ml: user ? 2 : 0,
                  mr: 2,
                  my: 2,
                  "&:hover, &:focus": {
                    "& .MuiButton-endIcon": {
                      transform: "scale(1.4)",
                    },
                  },
                  "& .MuiButton-endIcon": {
                    transition: "transform 500ms",
                    transformOrigin: "bottom left",
                  },
                }}
                // @ts-expect-error Overridden components' types are weird with `component`
                component={Link}
                to={user ? "/app/" : "/login/new/"}
                endIcon={
                  user ? <MaterialSymbolIcon icon="rocket_launch" /> : null
                }
              >
                {user
                  ? t("header.buttons.launch")
                  : t("header.buttons.createAcc")}
              </LargeButton>
              {user ? null : (
                <LargeButton
                  // @ts-expect-error Overridden components' types are weird with `component`
                  component={Link}
                  to="/login/"
                  sx={{
                    my: 2,
                  }}
                >
                  {t("header.buttons.login")}
                </LargeButton>
              )}
            </Grid>
          </Grid>
        </Box>
        <Typography variant="h4" component="h2" textAlign="center">
          {t("why.header")}
        </Typography>
        <Grid container spacing={2} my={2}>
          {features.map((feature) => (
            <FeatureListItem feature={feature} key={feature.name} />
          ))}
        </Grid>
        <Divider />
        <Typography variant="body1" textAlign="center" p={2}>
          {t("footer")}
        </Typography>
      </Box>
    </>
  );
}
