import {
  AppBar,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
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
import { useTranslation } from "react-i18next";
import { PrivacyLevel } from "../../../../../../model/channel";
import MaterialSymbolIcon from "../../../../../components/MaterialSymbolIcon";
import useSnackbar from "../../../../../components/useSnackbar";
import useBackend from "../../../../../hooks/useBackend";

export interface CreateProps {
  onClose: () => void;
}

export default function Create({ onClose }: CreateProps) {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel | null>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const backend = useBackend();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation("channel");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (privacyLevel === null) return;
    const formData = new FormData(e.currentTarget);
    backend
      .createChannel(
        formData.get("name") as string,
        formData.get("description") as string,
        privacyLevel,
        privacyLevel === PrivacyLevel.UNLISTED
          ? (formData.get("password") as string)
          : undefined
      )
      .then((channel) => {
        showSnackbar(
          t("snackbar.createChannelSuccess", { channelName: channel.name })
        );
        onClose();
      })
      .catch((err) => {
        console.error(err);
        showSnackbar(t("snackbar.createChannelFailed"));
        // To prevent annoying people from autoclicking...
        onClose();
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      {fullScreen ? (
        <>
          <AppBar>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onClose}>
                <MaterialSymbolIcon icon="close" />
              </IconButton>
              <Typography variant="h5" component="h2" ml={2} flex={1}>
                {t("createChannel")}
              </Typography>
              <Button color="inherit" type="submit">
                {t("createChannelContinue")}
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      ) : (
        <DialogTitle>{t("createChannel")}</DialogTitle>
      )}
      <DialogContent>
        <Stack spacing={2} minWidth={300}>
          <TextField label={t("channelInfo.name")} name="name" sx={{ mt: 1 }} />
          <TextField
            label={t("channelInfo.description")}
            multiline
            name="description"
          />
          <FormControl fullWidth>
            <InputLabel>{t("channelInfo.privacyLevel")}</InputLabel>
            <Select
              label={t("channelInfo.privacyLevel")}
              value={privacyLevel ?? ""}
              name="privacyLevel"
              onChange={(e) =>
                setPrivacyLevel(
                  typeof e.target.value === "string" ? null : e.target.value
                )
              }
              renderValue={(value) => {
                if (value === PrivacyLevel.PRIVATE) {
                  return t("channelInfo.private");
                }
                if (value === PrivacyLevel.UNLISTED) {
                  return t("channelInfo.unlisted");
                }
                return t("channelInfo.public");
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxWidth: 400,
                  },
                },
              }}
            >
              <MenuItem value={PrivacyLevel.PRIVATE}>
                <ListItemText
                  primary={t("channelInfo.private")}
                  secondary={t("channelInfo.privateHint")}
                  secondaryTypographyProps={{ whiteSpace: "normal" }}
                />
              </MenuItem>
              <MenuItem value={PrivacyLevel.UNLISTED}>
                <ListItemText
                  primary={t("channelInfo.unlisted")}
                  secondary={t("channelInfo.unlistedHint")}
                  secondaryTypographyProps={{ whiteSpace: "normal" }}
                />
              </MenuItem>
              <MenuItem value={PrivacyLevel.PUBLIC}>
                <ListItemText
                  primary={t("channelInfo.public")}
                  secondary={t("channelInfo.publicHint")}
                  secondaryTypographyProps={{ whiteSpace: "normal" }}
                />
              </MenuItem>
            </Select>
          </FormControl>
          <Collapse
            in={privacyLevel === PrivacyLevel.UNLISTED}
            sx={{ width: "100%" }}
          >
            <TextField
              label={t("join.passphrase.password")}
              name="password"
              fullWidth
            />
          </Collapse>
        </Stack>
      </DialogContent>
      {fullScreen ? null : (
        <DialogActions>
          <Button onClick={onClose}>{t("createChannelCancel")}</Button>
          <Button type="submit">{t("createChannelContinue")}</Button>
        </DialogActions>
      )}
    </form>
  );
}
