import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import Channel, { PrivacyLevel } from "../../../model/channel";
import useBackend from "../../hooks/useBackend";
import useUser from "../../hooks/useUser";
import LoadingButton from "../LoadingButton";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import useSnackbar from "../useSnackbar";
import { SideSheetToolbar } from "./Chat";

export interface InfoMenuProps {
  channel: Channel;
  handleSidebarClose(): void;
  sx?: SxProps;
}

export default function InfoMenu({
  channel,
  sx,
  handleSidebarClose,
}: InfoMenuProps) {
  const user = useUser();
  const canEdit =
    channel.dm || channel.membersCanEdit || channel.owner === user?.id;
  const [pendingChange, setPendingChange] = useState<Channel>(() => channel);
  const handleChange =
    <
      T extends
        | "name"
        | "description"
        | "privacyLevel"
        | "history"
        | "passphrase"
    >(
      inputType: T
    ) =>
    (event: { target: { value: Channel[T] } }) => {
      setPendingChange((oldPendingChange) => ({
        ...oldPendingChange,
        [inputType]: event.target.value,
      }));
    };
  const handlePrivacyLevelChange = (
    _event: unknown,
    newPrivacyLevel: PrivacyLevel | null
  ) => {
    if (newPrivacyLevel !== null) {
      handleChange("privacyLevel")({ target: { value: newPrivacyLevel } });
    }
  };
  const handleMembersCanEditChange = (_event: unknown, checked: boolean) => {
    setPendingChange((oldPendingChange) => ({
      ...oldPendingChange,
      membersCanEdit: checked,
    }));
  };
  const isPendingChanges =
    pendingChange.name !== channel.name ||
    pendingChange.description !== channel.description ||
    pendingChange.privacyLevel !== channel.privacyLevel ||
    (!pendingChange.dm &&
      !channel.dm &&
      pendingChange.membersCanEdit !== channel.membersCanEdit);
  const backend = useBackend();
  const { showSnackbar } = useSnackbar();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    backend
      .updateChannel(channel.id, {
        description: pendingChange.description,
        privacyLevel: pendingChange.privacyLevel,
        name: pendingChange.name,
        membersCanEdit:
          "membersCanEdit" in pendingChange
            ? pendingChange.membersCanEdit
            : undefined,
      })
      .then(() => {
        // TODO: translate
        showSnackbar("Changes saved.");
      })
      .catch(() => {
        // TODO: translate
        showSnackbar("Failed to save changes.");
      });
  };
  const [deletionOpen, setDeletionOpen] = useState(false);
  const handleDeleteChannel = () => {
    setDeletionOpen(false);
    backend
      .deleteChannel(channel.id)
      .then(() => {
        // TODO: translate
        showSnackbar("Channel deleted.");
      })
      .catch(() => {
        // TODO: translate
        showSnackbar("Failed to delete channel.");
      });
  };
  const { t } = useTranslation("channel");
  return (
    <>
      <SideSheetToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t("channelInfo.title")}
        </Typography>
        <IconButton onClick={handleSidebarClose} edge="end">
          <MaterialSymbolIcon icon="close" />
        </IconButton>
      </SideSheetToolbar>
      <Stack sx={sx} spacing={2} component="form" onSubmit={handleSubmit}>
        <Dialog open={deletionOpen} onClose={() => setDeletionOpen(false)}>
          {/* TODO: Translate */}
          <DialogTitle>[untranslated] Delete channel?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this channel? This action{" "}
              <em>cannot be undone</em>. All associated messages and their
              attachments, images, and more will be <em>deleted forever</em>.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletionOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteChannel}>Confirm</Button>
          </DialogActions>
        </Dialog>
        {!pendingChange.dm ? (
          <FormControlLabel
            control={<Checkbox checked={pendingChange.membersCanEdit} />}
            onChange={handleMembersCanEditChange}
            label="Members can edit"
            disabled={pendingChange.owner !== user?.id}
          />
        ) : null}
        <TextField
          label={t("channelInfo.name")}
          value={pendingChange.name}
          onChange={handleChange("name")}
          InputProps={{
            readOnly: !canEdit,
          }}
        />
        <TextField
          label={t("channelInfo.description")}
          value={pendingChange.description}
          onChange={handleChange("description")}
          multiline
          InputProps={{
            readOnly: !canEdit,
          }}
        />
        <ToggleButtonGroup
          value={pendingChange.privacyLevel}
          exclusive
          onChange={handlePrivacyLevelChange}
          fullWidth
          disabled={!canEdit}
        >
          <ToggleButton value={PrivacyLevel.PRIVATE}>
            {t("channelInfo.private")}
          </ToggleButton>
          <ToggleButton value={PrivacyLevel.UNLISTED}>
            {t("channelInfo.unlisted")}
          </ToggleButton>
          <ToggleButton value={PrivacyLevel.PUBLIC}>
            {t("channelInfo.public")}
          </ToggleButton>
        </ToggleButtonGroup>
        <Collapse
          in={pendingChange.privacyLevel === PrivacyLevel.UNLISTED}
          sx={{ width: "100%" }}
        >
          <TextField
            label={t("join.passphrase.password")}
            value={pendingChange.passphrase ?? ""}
            onChange={handleChange("passphrase")}
            fullWidth
            disabled={!channel.dm && !channel.membersCanEdit}
          />
        </Collapse>
        {canEdit ? (
          <Box>
            <LoadingButton
              disabled={!isPendingChanges}
              variant="filled"
              type="submit"
            >
              {t("channelInfo.save")}
            </LoadingButton>{" "}
            {isPendingChanges ? (
              <Typography variant="caption" fontStyle="italic">
                {t("channelInfo.pendingChanges")}
              </Typography>
            ) : (
              // TODO: Translate
              <Button variant="tonal" onClick={() => setDeletionOpen(true)}>
                Delete channel
              </Button>
            )}
          </Box>
        ) : null}
      </Stack>
    </>
  );
}
