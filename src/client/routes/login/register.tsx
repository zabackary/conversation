import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  AlertTitle,
  Avatar,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrivacyPolicy from "../../../documents/privacyPolicy";
import TermsOfUse from "../../../documents/termsOfUse";
import LoadingButton from "../../components/LoadingButton";
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
  const formData = useRef<FormData>();
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formData.current = new FormData(event.currentTarget);
    setInvalid(false);
    setIsTermsDialogOpen(true);
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
  const theme = useTheme();
  const location = useLocation();
  const handleFinalSubmission = () => {
    setLoading(true);
    const data = formData.current;
    if (!data) throw new Error("Cannot get form data!");
    backend
      .authCreateAccount(
        {
          email: `${data.get("email") as string}@stu.his.ac.jp`,
        },
        data.get("password") as string
      )
      .then(() => {
        setLoading(false);
        navigate(next ?? "/");
      })
      .catch((error) => {
        setLoading(false);
        setInvalid(true);
        setIsTermsDialogOpen(false);
        throw error;
      });
  };
  useEffect(() => {
    if (invalid === true)
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
  }, [invalid]);
  const { t } = useTranslation("login");
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        {t("newAccount")}
      </Typography>
      <Collapse in={invalid}>
        <Alert severity="error" sx={{ m: 1 }}>
          <AlertTitle>{t("alert.createError.header")}</AlertTitle>
          {t("alert.createError.description")}
        </Alert>
      </Collapse>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, maxWidth: "100%" }}
      >
        <Header index={0} title={t("emailStep.header")} />
        <TextField
          margin="normal"
          required
          fullWidth
          id={emailId}
          label={t("email")}
          name="email"
          autoComplete="email"
          autoFocus
          helperText={t("emailStep.warning")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">@stu.his.ac.jp</InputAdornment>
            ),
          }}
        />
        <Header index={1} title={t("passwordStep.header")} />
        <Stack>
          <Tooltip title={t("passwordStep.comicClick")}>
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
                  alt={t("passwordStep.comicLabel")}
                  width={740 / 2}
                  height={601 / 2}
                />
              </Box>
            </Button>
          </Tooltip>
          <Typography variant="caption">
            {t("passwordStep.comicLabel")}
          </Typography>
        </Stack>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("password")}
          type={showPassword ? "text" : "password"}
          id={passwordId}
          autoComplete="current-password"
          helperText={t("passwordStep.warning")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility" // untranslated
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

        <Grid container>
          <Grid item xs>
            <Button
              component={RouterLink}
              to={`/login/${location.search}`}
              variant="tonal"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<ArrowBackIcon />}
            >
              {t("signIn")}
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="filled" sx={{ mt: 3, mb: 2 }}>
              {t("next")}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={isTermsDialogOpen}
          onClose={() => setIsTermsDialogOpen(false)}
          scroll="paper"
        >
          <DialogTitle>{t("notices.header")}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="h5">Terms of use</Typography>
            <DialogContentText component="div">
              <TermsOfUse />
            </DialogContentText>
            <Typography variant="h5">Privacy policy</Typography>
            <DialogContentText component="div">
              <PrivacyPolicy />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsTermsDialogOpen(false)}>
              {t("notices.cancel")}
            </Button>
            <LoadingButton
              onClick={handleFinalSubmission}
              loading={loading}
              autoFocus
            >
              {t("notices.continue")}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
