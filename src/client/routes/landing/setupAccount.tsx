import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Paper,
  Popover,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../components/ImagePicker";
import LoadingButton from "../../components/LoadingButton";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";
import useSnackbar from "../../components/useSnackbar";
import useBackend from "../../hooks/useBackend";

export default function SetupAccountRoute() {
  const [activeStep, setActiveStep] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [name, setName] = useState("");

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");

  const backend = useBackend();

  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleComplete = () => {
    setIsLoading(true);
    backend
      .setUserDetails({
        name,
        profilePicture: profilePicture ?? undefined,
        nickname,
      })
      .then(() => {
        // Bad workaround for waiting for the user to refresh.
        setTimeout(() => {
          navigate("/app");
        }, 1500);
      })
      .catch(() => {
        showSnackbar("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    void confetti();
  }, []);
  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 6, pb: 8 }}>
      <Popover
        open={!!popoverAnchor}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <ImagePicker
          allowFiles={false}
          onImageSelected={(value) => {
            if (typeof value === "string") {
              setPopoverAnchor(null);
              setProfilePicture(value);
            }
          }}
        />
      </Popover>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, md: 3 },
          borderRadius: 3,
        }}
      >
        <MaterialSymbolIcon
          sx={{ mb: 1, mx: "auto" }}
          size={48}
          icon="manage_accounts"
          color="primary"
        />
        <Typography component="h1" variant="h5" mb={2} textAlign="center">
          Let&apos;s get you set up.
        </Typography>
        <Typography mb={2} textAlign="center">
          We just need a little bit of information before you can begin
          chatting.
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Set your name</StepLabel>
            <StepContent>
              <Typography>
                This name is the one shown in your profile, and not in the chat.
              </Typography>
              <TextField
                value={name}
                variant="filled"
                label="Name"
                fullWidth
                sx={{ my: 1 }}
                helperText="Please use your real name"
                onChange={(e) => setName(e.currentTarget.value)}
              />
              <Box sx={{ mb: 1 }}>
                <Button
                  disabled={name === ""}
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Choose how you look</StepLabel>
            <StepContent>
              <Typography>
                Your nickname and profile picture will be shown inline with your
                messages. Don&apos;t worry; you don&apos;t need a profile
                picture.
              </Typography>
              <Stack direction="row" alignItems="center">
                <IconButton onClick={(e) => setPopoverAnchor(e.currentTarget)}>
                  <Avatar src={profilePicture ?? undefined}>
                    {!profilePicture ? (
                      <MaterialSymbolIcon icon="edit" color="inherit" />
                    ) : null}
                  </Avatar>
                </IconButton>
                <TextField
                  value={nickname}
                  variant="filled"
                  label="Nickname"
                  fullWidth
                  sx={{ my: 1, ml: 0.5 }}
                  onChange={(e) => setNickname(e.currentTarget.value)}
                />
              </Stack>
              <Box sx={{ mb: 1 }}>
                <Button
                  disabled={nickname === ""}
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Next
                </Button>
                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Last steps</StepLabel>
            <StepContent>
              <Typography mb={1}>
                You can always change this information in Settings &gt; Account.
              </Typography>
              <Typography>
                Remember that by using this app, you agree to abide by the{" "}
                <Link href={import.meta.env.CLIENT_TOS_URL} target="_blank">
                  Terms of Service
                </Link>{" "}
                and respect the{" "}
                <Link
                  href={import.meta.env.CLIENT_PRIVACY_POLICY_URL}
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Typography>
              <Box sx={{ mb: 1 }}>
                <LoadingButton
                  variant="contained"
                  onClick={handleComplete}
                  sx={{ mt: 1, mr: 1 }}
                  loading={isLoading}
                >
                  Get started
                </LoadingButton>
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={isLoading}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </Paper>
    </Container>
  );
}
