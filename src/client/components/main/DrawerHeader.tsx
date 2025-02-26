import {
  Avatar,
  Badge,
  BadgeProps,
  Box,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import User from "../../../model/user";
import useUserActivity from "../../hooks/useUserActivity";

export const ContrastBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `2px solid ${theme.palette.background.paper}`,
    width: "14px",
    height: "14px",
    borderRadius: "7px",
  },
}));

interface DrawerHeaderProps {
  user: User | null;
}

export default function DrawerHeader({ user }: DrawerHeaderProps) {
  const active = useUserActivity(user?.id ?? "");
  return (
    <Box sx={{ padding: "12px", paddingTop: "18px" }}>
      {user ? (
        <Box sx={{ display: "flex" }}>
          <ContrastBadge
            color={active ? "success" : "error"}
            variant="dot"
            sx={{ marginRight: "8px" }}
            overlap="circular"
          >
            <Avatar
              alt={`${user.name}'s profile picture`}
              src={user.profilePicture ?? undefined}
            >
              {(user.nickname ?? user.name)[0]}
            </Avatar>
          </ContrastBadge>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6">{user.name}</Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {user.nickname} · {user.email}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex" }}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ marginRight: "8px" }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" aria-label="Loading...">
              <Skeleton />
            </Typography>
            <Typography
              variant="caption"
              component="div"
              aria-label="Loading..."
            >
              <Skeleton />
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
