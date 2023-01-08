import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Box, Fade, Paper } from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import {
  useMatches,
  useNavigate,
  useOutlet,
  useSearchParams,
} from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import useRouteForward from "../../hooks/useRouteForward";
import useUser from "../../hooks/useUser";

export default function LoginRootRoute() {
  useRouteForward();

  const [, match] = useMatches();
  const currentOutlet = useOutlet();
  const user = useUser(false);
  const navigate = useNavigate();
  const [searchParams, _setSearchParams] = useSearchParams();
  useEffect(() => {
    if (user !== null && searchParams.has("next")) {
      navigate(searchParams.get("next") ?? "/", { replace: true });
    }
  }, [user, searchParams, navigate]);
  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 8, pb: 8 }}>
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
          <LockOutlinedIcon />
        </Avatar>
        <SwitchTransition>
          <Fade key={match.pathname} timeout={200} unmountOnExit>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              {user === null ? (
                <>You&apos;re already logged in.</>
              ) : (
                currentOutlet
              )}
            </Box>
          </Fade>
        </SwitchTransition>
      </Paper>
    </Container>
  );
}
