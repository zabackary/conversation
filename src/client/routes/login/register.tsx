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
  FormControlLabel,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  FormEvent,
  MouseEventHandler,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PrivacyPolicy from "../../../documents/privacyPolicy";
import TermsOfUse from "../../../documents/termsOfUse";
import ImagePicker from "../../components/ImagePicker";
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
  const [imagePickerAnchor, setImagePickerAnchor] =
    useState<HTMLButtonElement | null>(null);
  const handleImagePickerOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    setImagePickerAnchor(e.currentTarget);
  };
  const handleImagePickerClose = () => {
    setImagePickerAnchor(null);
  };
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const handleFinalSubmission = () => {
    setLoading(true);
    const data = formData.current;
    if (!data) throw new Error("Cannot get form data!");
    const pfp = data.get("profilePicture") as string;
    backend
      .authCreateAccount(
        {
          email: `${data.get("email") as string}@stu.his.ac.jp`,
          name: `${data.get("firstName") as string} ${
            data.get("lastName") as string
          }`,
          nickname: data.get("nickname") as string,
          profilePicture: pfp === "" ? undefined : pfp,
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

  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        Create account
      </Typography>
      <Collapse in={invalid}>
        <Alert severity="error" sx={{ m: 1 }}>
          <AlertTitle>Something went wrong.</AlertTitle>
          Check if your email and password meet the criteria. If the issue
          persists, contact the developer.
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
            <input type="hidden" name="profilePicture" value={avatarUrl} />
            <FormControlLabel
              control={
                <IconButton onClick={handleImagePickerOpen}>
                  <Avatar src={avatarUrl} />
                </IconButton>
              }
              label="Profile picture"
            />
            <Popover
              id={undefined}
              open={!!imagePickerAnchor}
              anchorEl={imagePickerAnchor}
              onClose={handleImagePickerClose}
              anchorOrigin={{
                horizontal: "left",
                vertical: "top",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              PaperProps={{
                sx: {
                  width: "100%",
                  maxWidth: "600px",
                },
              }}
            >
              <ImagePicker
                onImageSelected={(url) =>
                  setAvatarUrl(url === "" ? undefined : url)
                }
                allowFiles={false}
              />
            </Popover>
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
            <Button type="submit" variant="filled" sx={{ mt: 3, mb: 2 }}>
              Next
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={isTermsDialogOpen}
          onClose={() => setIsTermsDialogOpen(false)}
          scroll="paper"
        >
          <DialogTitle>Notices</DialogTitle>
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
            <Button onClick={() => setIsTermsDialogOpen(false)}>Cancel</Button>
            <LoadingButton
              onClick={handleFinalSubmission}
              loading={loading}
              autoFocus
            >
              Accept and continue
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
