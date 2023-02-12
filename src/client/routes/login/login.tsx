import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useId, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import useBackend from "../../hooks/useBackend";

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

  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        Sign in
      </Typography>
      <Stack>
        <Collapse in={!!next}>
          <Alert severity="warning" sx={{ m: 1 }}>
            You must be logged in to use Conversation.
          </Alert>
        </Collapse>
        <Collapse in={invalid}>
          <Alert severity="error" sx={{ m: 1 }}>
            <AlertTitle>Something went wrong.</AlertTitle>
            Check your email and password for typos. If the issue persists,
            contact the developer.
          </Alert>
        </Collapse>
      </Stack>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id={emailId}
          label="Email"
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
          label="Password"
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
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Grid container>
          <Grid item xs>
            <Button
              component={RouterLink}
              to={`/login/new/${location.search}`}
              variant="tonal"
              sx={{ mt: 3, mb: 2 }}
            >
              New Account
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              type="submit"
              variant="filled"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              Sign In
            </LoadingButton>
          </Grid>
        </Grid>
        <Link
          component={RouterLink}
          to={`/login/passwordreset/${window.location.search}`}
          variant="body2"
        >
          Forgot password?
        </Link>{" "}
        -{" "}
        <Link
          component={RouterLink}
          to={`/login/help/${window.location.search}`}
          variant="body2"
        >
          Help
        </Link>{" "}
        -{" "}
        <Link
          component={RouterLink}
          to={`/login/settings/${window.location.search}`}
          variant="body2"
        >
          Appearance preferences
        </Link>
      </Box>
    </>
  );
}
