import {
  Box,
  Collapse,
  Stack,
  SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { shallowEqualObjects } from "shallow-equal";
import Channel, { PrivacyLevel } from "../../../model/channel";
import LoadingButton from "../LoadingButton";

export interface InfoMenuProps {
  channel: Channel;
  sx?: SxProps;
}

export default function InfoMenu({ channel, sx }: InfoMenuProps) {
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
  const isPendingChanges = useMemo(
    () => !shallowEqualObjects(pendingChange, channel),
    [pendingChange, channel]
  );
  return (
    <Stack sx={sx} spacing={2} component="form">
      <TextField
        label="Name"
        value={pendingChange.name}
        onChange={handleChange("name")}
      />
      <TextField
        label="Description"
        value={pendingChange.description}
        onChange={handleChange("description")}
        multiline
      />
      <ToggleButtonGroup
        value={pendingChange.privacyLevel}
        exclusive
        onChange={handlePrivacyLevelChange}
        fullWidth
      >
        <ToggleButton value={PrivacyLevel.Private}>Private</ToggleButton>
        <ToggleButton value={PrivacyLevel.Unlisted}>Unlisted</ToggleButton>
        <ToggleButton value={PrivacyLevel.Public}>Public</ToggleButton>
      </ToggleButtonGroup>
      <Collapse
        in={pendingChange.privacyLevel === PrivacyLevel.Unlisted}
        sx={{ width: "100%" }}
      >
        <TextField
          label="Passphrase"
          value={pendingChange.passphrase ?? ""}
          onChange={handleChange("passphrase")}
          fullWidth
        />
      </Collapse>
      <Box>
        <LoadingButton
          disabled={!isPendingChanges}
          variant="filled"
          type="submit"
        >
          Save
        </LoadingButton>{" "}
        {isPendingChanges ? (
          <Typography variant="caption" fontStyle="italic">
            Pending changes
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
}
