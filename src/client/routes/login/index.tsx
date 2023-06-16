import {
  Avatar,
  Box,
  Fade,
  IconButton,
  Link as MuiLink,
  Paper,
} from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  useMatches,
  useNavigate,
  useOutlet,
  useSearchParams,
} from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";
import LanguagePickerDialog from "../../components/layout/LanguagePickerDialog";
import useBackendAttributes from "../../hooks/useBackendAttributes";
import useRouteForward from "../../hooks/useRouteForward";
import useUser from "../../hooks/useUser";

export default function LoginRootRoute() {
  useRouteForward();

  const [, match] = useMatches();
  const currentOutlet = useOutlet();
  const user = useUser(false);
  const navigate = useNavigate();
  const [searchParams, _setSearchParams] = useSearchParams();
  const attributes = useBackendAttributes();
  useEffect(() => {
    if (attributes?.onboarding) {
      navigate("/account_setup", { replace: true });
    } else if (attributes?.recovery) {
      navigate("/app/settings/account", { replace: true });
    } else if (user !== null && searchParams.has("next")) {
      navigate(searchParams.get("next") ?? "/", { replace: true });
    }
  }, [
    user,
    searchParams,
    navigate,
    attributes?.onboarding,
    attributes?.recovery,
  ]);
  const { i18n } = useTranslation();
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const handleLanguagePickerClose = (language: string | undefined) => {
    setLanguagePickerOpen(false);
    if (language) void i18n.changeLanguage(language);
  };
  const handleLanguagePickerOpen = () => {
    setLanguagePickerOpen(true);
  };
  return (
    <>
      <LanguagePickerDialog
        open={languagePickerOpen}
        onClose={handleLanguagePickerClose}
      />
      <Container component="main" maxWidth="xs" sx={{ pt: 6, pb: 8 }}>
        <IconButton
          onClick={handleLanguagePickerOpen}
          sx={{ position: "fixed", bottom: 12, left: 12 }}
          size="large"
        >
          <MaterialSymbolIcon icon="translate" />
        </IconButton>
        <MuiLink
          sx={{
            fontSize: 34,
            textDecoration: "none",
            textAlign: "center",
            color: "tertiary.main",
            display: "block",
            mb: 2,
          }}
          component={Link}
          to="/"
        >
          Conversation
        </MuiLink>
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: { xs: 2, md: 3 },
            borderRadius: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <MaterialSymbolIcon icon="lock" />
          </Avatar>
          <SwitchTransition>
            <Fade key={match?.pathname} timeout={200} unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {user !== null ? (
                  <>[untranslated] You&apos;re already logged in.</>
                ) : (
                  currentOutlet
                )}
              </Box>
            </Fade>
          </SwitchTransition>
        </Paper>
      </Container>
    </>
  );
}
