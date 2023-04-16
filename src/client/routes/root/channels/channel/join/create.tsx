import {
  Alert,
  AppBar,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FormEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { PrivacyLevel } from "../../../../../../model/channel";
import useBackend from "../../../../../hooks/useBackend";
import useSnackbar from "../../../../../components/useSnackbar";

export interface CreateProps {
  onClose: () => void;
}

export default function Create({ onClose }: CreateProps) {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel | null>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const backend = useBackend();
  const { showSnackbar } = useSnackbar();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacyLevel) return;
    const formData = new FormData(e.currentTarget);
    backend
      .createChannel(
        formData.get("name") as string,
        formData.get("description") as string,
        privacyLevel,
        privacyLevel === PrivacyLevel.Unlisted
          ? (formData.get("password") as string)
          : undefined
      )
      .then((channel) => {
        showSnackbar(
          `Successfully created the channel "${channel.name}". Reload to start chatting!`
        );
        onClose();
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Failed to create channel.");
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      {fullScreen ? (
        <>
          <AppBar>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h5" component="h2" ml={2} flex={1}>
                Create channel
              </Typography>
              <Button color="inherit" type="submit">
                Create
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      ) : (
        <DialogTitle>[untranslated] Create channel</DialogTitle>
      )}
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            Currently, this section is <b>untranslated</b>. We apologize for the
            inconvenience.
          </Alert>
          <TextField label="Channel name" name="name" />
          <TextField label="Description" multiline name="description" />
          <FormControl fullWidth>
            <InputLabel>Privacy level</InputLabel>
            <Select
              label="Privacy level"
              value={privacyLevel ?? ""}
              name="privacyLevel"
              onChange={(e) =>
                setPrivacyLevel(
                  typeof e.target.value === "string" ? null : e.target.value
                )
              }
            >
              <MenuItem value={PrivacyLevel.Private}>Private</MenuItem>
              <MenuItem value={PrivacyLevel.Unlisted}>Unlisted</MenuItem>
              <MenuItem value={PrivacyLevel.Public}>Public</MenuItem>
            </Select>
          </FormControl>
          <Collapse
            in={privacyLevel === PrivacyLevel.Unlisted}
            sx={{ width: "100%" }}
          >
            <TextField label="Passphrase" name="password" fullWidth />
          </Collapse>
        </Stack>
      </DialogContent>
      {fullScreen ? null : (
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      )}
    </form>
  );
}
