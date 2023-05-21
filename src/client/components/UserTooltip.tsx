import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("general");
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
              <InlineBadge color="secondary" badgeContent={t("admin")} />
            ) : null}
            {user.privilegeLevel === PrivilegeLevel.Unverified ? (
              <InlineBadge color="warning" badgeContent={t("unverified")} />
            ) : null}
            {user.disabled ? (
              <InlineBadge color="error" badgeContent={t("disabled")} />
            ) : null}
          </Stack>
        </Stack>
      </Stack>
      {user.disabled ? (
        <Typography variant="body2">
          {t("peopleCard.disabledExplanation")}
        </Typography>
      ) : null}
      <Box>
        <Button size="small" disabled={disabled}>
          {t("peopleCard.goToDm")}
        </Button>{" "}
        <Button size="small" disabled={disabled}>
          {t("peopleCard.viewProfile")}
        </Button>
      </Box>
    </Stack>
  );
}
