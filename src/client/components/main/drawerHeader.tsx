import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import User from "../../../data/user";

interface DrawerHeaderProps {
  user: User | null;
}

export default function DrawerHeader({ user }: DrawerHeaderProps) {
  return (
    <Box sx={{ padding: "12px", paddingTop: "18px" }}>
      {user ? (
        <Box sx={{ display: "flex" }}>
          <Avatar
            alt={`${user.name}'s profile picture`}
            src={user.profilePicture}
            sx={{ marginRight: "8px" }}
          />
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
            <Typography variant="h6">
              <Skeleton />
            </Typography>
            <Typography variant="caption" component="div">
              <Skeleton />
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
