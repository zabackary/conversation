import { Box, Button, Stack, Typography } from "@mui/material";
import User, { PrivilegeLevel } from "../../model/user";
import { InlineBadge } from "./chat/ChatItem";
import ProfilePicture from "./ProfilePicture";

export interface UserTooltipProps {
  user: User;
}

export default function UserTooltip({ user }: UserTooltipProps) {
  return (
    <Stack spacing={1} p={1} width={340}>
      <Stack direction="row" spacing={1}>
        <ProfilePicture user={user} sx={{ width: 48, height: 48 }} />
        <Stack>
          <Typography variant="body1">{user.name}</Typography>
          <Typography variant="body2" mb={1}>
            {user.nickname} {user.email ? <>&middot; {user.email}</> : null}
          </Typography>
          {user.privilegeLevel === PrivilegeLevel.Admin ? (
            <InlineBadge color="secondary" badgeContent="Admin" />
          ) : null}
          {user.privilegeLevel === PrivilegeLevel.Unverified ? (
            <InlineBadge color="warning" badgeContent="Unverified" />
          ) : null}
        </Stack>
      </Stack>
      <Box>
        <Button size="small">Go to DM</Button>{" "}
        <Button size="small">View profile</Button>
      </Box>
    </Stack>
  );
}
