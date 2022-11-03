import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import User from "../../../data/user";

interface DrawerHeaderProps {
  user: User | null;
}

export default function DrawerHeader(props: DrawerHeaderProps) {
  return (
    <div style={{ padding: "12px", paddingTop: "18px" }}>
      {props.user ? (
        <Box sx={{ display: "flex" }}>
          <Avatar
            alt={props.user.name}
            src={props.user.profilePicture}
            sx={{ marginRight: "8px" }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6">{props.user.name}</Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {props.user.nickname} · {props.user.email}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Skeleton
            variant="circular"
            width="40"
            height="40"
            sx={{ float: "left", marginRight: "8px" }}
          />
        </>
      )}
    </div>
  );
}
