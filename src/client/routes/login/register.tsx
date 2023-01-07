import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  AlertTitle,
  Avatar,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import useBackend from "../../hooks/useBackend";

function Header({ index, title }: { index: number; title: string }) {
  return (
    <Stack direction="row" spacing={1} my={1}>
      <Avatar sx={{ bgcolor: "secondary.main", width: 28, height: 28 }}>
        {index + 1}
      </Avatar>
      <Typography component="h2" variant="subtitle1">
        {title}
      </Typography>
    </Stack>
  );
}

export default function LoginRegisterRoute() {
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
  const firstNameId = useId();
  const lastNameId = useId();
  const nicknameId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const theme = useTheme();
  const location = useLocation();

  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        Create account
      </Typography>
      <Collapse in={invalid}>
        <Alert severity="error" sx={{ m: 1 }}>
          <AlertTitle>Something went wrong.</AlertTitle>
          Check your email and password for typos. If the issue persists,
          contact the developer.
        </Alert>
      </Collapse>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, maxWidth: "100%" }}
      >
        <Header index={0} title="Enter your email" />
        <TextField
          margin="normal"
          required
          fullWidth
          id={emailId}
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          helperText="You can only create one account per email."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">@stu.his.ac.jp</InputAdornment>
            ),
          }}
        />
        <Header index={1} title="Choose a password" />
        <Stack>
          <Tooltip title="Open comic in new tab">
            <Button
              sx={{
                borderRadius: 3,
              }}
              component="a"
              href="https://xkcd.com/936/"
              target="_blank"
            >
              <Box
                sx={{
                  overflow: "hidden",
                  height: 150,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: "absolute",
                    width: 8,
                    background: `linear-gradient(to right, transparent, ${theme.palette.background.default})`,
                  },
                  "&::before": {
                    content: '""',
                    right: 0,
                    left: 0,
                    bottom: 0,
                    position: "absolute",
                    height: 8,
                    background: `linear-gradient(to bottom, transparent, ${theme.palette.background.default})`,
                  },
                }}
              >
                <img
                  src="https://imgs.xkcd.com/comics/password_strength.png"
                  alt="An XKCD comic showing how to choose a strong password."
                  width={740 / 2}
                  height={601 / 2}
                />
              </Box>
            </Button>
          </Tooltip>
          <Typography variant="caption">
            Comic about choosing a password: click to expand
          </Typography>
        </Stack>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id={passwordId}
          autoComplete="current-password"
          helperText="Keep your password secret."
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
        <Header index={2} title="Decide how others see you" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id={firstNameId}
              label="First Name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id={lastNameId}
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id={nicknameId}
              label="Nickname"
              name="nickname"
              autoComplete="nickname"
              helperText="This is how your name will display on messages"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <IconButton onClick={() => console.log("click")}>
                  <Avatar sx={{ m: "auto" }}>H</Avatar>
                </IconButton>
              }
              label="Profile picture"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Button
              component={RouterLink}
              to={`/login/${location.search}`}
              variant="tonal"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<ArrowBackIcon />}
            >
              Log in
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="filled"
              sx={{ mt: 3, mb: 2, position: "relative" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  color="inherit"
                  size={16}
                  sx={{
                    position: "absolute",
                    top: "calc(50% - 8px)",
                    left: "calc(50% - 8px)",
                  }}
                />
              ) : null}
              <span
                style={{ visibility: loading ? "hidden" : "visible" }}
                aria-hidden={loading}
              >
                Create account
              </span>
            </Button>
          </Grid>
        </Grid>
        <Link component={RouterLink} to="/login/passwordreset/" variant="body2">
          Forgot password?
        </Link>{" "}
        -{" "}
        <Link component={RouterLink} to="/login/help/" variant="body2">
          Help
        </Link>{" "}
        -{" "}
        <Link component={RouterLink} to="/settings/appearance/" variant="body2">
          Appearance preferences
        </Link>
      </Box>
    </>
  );
}
