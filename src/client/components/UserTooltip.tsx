import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { MouseEventHandler } from "react";
import User, { PrivilegeLevel } from "../../model/user";
import MaterialSymbolIcon from "./MaterialSymbolIcon";
import ProfilePicture from "./ProfilePicture";
import { InlineBadge } from "./chat/ChatItem";
import { parseColor } from "./chat/DelayedEmojiPicker";

export interface UserTooltipProps {
  user: User;
  disabled?: boolean;
  onChangeProfilePicture?: MouseEventHandler<HTMLDivElement>;
}

export default function UserTooltip({
  user,
  disabled,
  onChangeProfilePicture,
}: UserTooltipProps) {
  const theme = useTheme();
  return (
    <Stack spacing={1} p={1} width={340}>
      <Stack direction="row" spacing={1}>
        <Box sx={{ position: "relative" }}>
          <ProfilePicture user={user} sx={{ width: 48, height: 48 }} />
          {onChangeProfilePicture ? (
            <Avatar
              sx={{
                height: 48,
                width: 48,
                position: "absolute",
                inset: 0,
                bgcolor: `rgba(${parseColor(theme.palette.onSurface.main).join(
                  ", "
                )}, 0.6)`,
                opacity: 0,
                transition: theme.transitions.create("opacity"),
                "&:hover": {
                  opacity: 1,
                },
                cursor: "pointer",
              }}
              onClick={onChangeProfilePicture}
            >
              <MaterialSymbolIcon icon="edit" />
            </Avatar>
          ) : null}
        </Box>
        <Stack>
          <Typography variant="body1">{user.name}</Typography>
          <Typography variant="body2" mb={1}>
            {user.nickname} {user.email ? <>&middot; {user.email}</> : null}
          </Typography>
          <Stack spacing={0.5} direction="row">
            {user.privilegeLevel === PrivilegeLevel.Admin ? (
              <InlineBadge color="secondary" badgeContent="Admin" />
            ) : null}
            {user.privilegeLevel === PrivilegeLevel.Unverified ? (
              <InlineBadge color="warning" badgeContent="Unverified" />
            ) : null}
            {user.disabled ? (
              <InlineBadge color="error" badgeContent="Disabled" />
            ) : null}
          </Stack>
        </Stack>
      </Stack>
      {user.disabled ? (
        <Typography variant="body2">
          This user has been disabled due to misconduct.
        </Typography>
      ) : null}
      <Box>
        <Button size="small" disabled={disabled}>
          Go to DM
        </Button>{" "}
        <Button size="small" disabled={disabled}>
          View profile
        </Button>
      </Box>
    </Stack>
  );
}
