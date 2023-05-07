import {
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useId, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../components/LoadingButton";
import useBackend from "../../hooks/useBackend";
import Footer from "./Footer";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";

export default function LoginRoute() {
  const backend = useBackend();
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, _setSearchParams] = useSearchParams();
  const next = searchParams.get("next");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setInvalid(false);
    setLoading(true);
    backend
      .authLogIn(
        `${data.get("email") as string}@stu.his.ac.jp`,
        data.get("password") as string
      )
      .then(() => {
        setLoading(false);
        navigate(next ?? "/");
      })
      .catch(() => {
        setLoading(false);
        setInvalid(true);
      });
  };
  const passwordId = useId();
  const emailId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const location = useLocation();
  const { t } = useTranslation("login");
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        {t("signIn")}
      </Typography>
      <Stack>
        <Collapse in={!!next}>
          <Alert severity="warning" sx={{ m: 1 }}>
            {t("alert.redirect")}
          </Alert>
        </Collapse>
        <Collapse in={invalid}>
          <Alert severity="error" sx={{ m: 1 }}>
            <AlertTitle>{t("alert.error.header")}</AlertTitle>
            {t("alert.error.description")}
          </Alert>
        </Collapse>
      </Stack>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id={emailId}
          label={t("email")}
          name="email"
          autoComplete="email"
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">@stu.his.ac.jp</InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("password")}
          type={showPassword ? "text" : "password"}
          id={passwordId}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <MaterialSymbolIcon icon="visibility_off" />
                  ) : (
                    <MaterialSymbolIcon icon="visibility" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Grid container>
          <Grid item xs>
            <Button
              component={RouterLink}
              to={`/login/new/${location.search}`}
              variant="tonal"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("newAccount")}
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              type="submit"
              variant="filled"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              {t("signIn")}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}
