import ChatIcon from "@mui/icons-material/Chat";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Channel from "../../../data/channel";

interface Props {
  channels?: Channel[] | null;
}

export default function ChannelList(props: Props) {
  const { pathname: path } = useLocation();
  const { channels } = props;

  return (
    <>
      {(!channels ? Array<undefined>(3).fill(undefined) : channels).map(
        (channel, index) => (
          <Box
            key={channel?.id || index}
            component="li"
            sx={{ display: "block", margin: "8px", borderRadius: "4px" }}
          >
            <ListItem
              disablePadding
              component={channel ? Link : "div"}
              to={channel ? `/channel/${channel.id}` : ""}
              sx={{
                color: "inherit",
                textDecoration: "inherit",
              }}
            >
              <ListItemButton
                selected={channel ? path === `/channel/${channel.id}` : false}
                disabled={!channel}
                sx={{ opacity: "1 !important", borderRadius: "8px" }}
              >
                <ListItemIcon>
                  {channel ? (
                    <ChatIcon />
                  ) : (
                    <Skeleton variant="circular" width={24} height={24} />
                  )}
                </ListItemIcon>
                {channel ? (
                  <ListItemText
                    primary={channel.name}
                    secondary={channel.lastMessage?.markdown}
                    primaryTypographyProps={{
                      sx: {
                        color:
                          channel && path === `/channel/${channel.id}`
                            ? "primary.dark"
                            : "inherit",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      sx: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height="1.5rem"
                    sx={{ margin: "4px 0" }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Box>
        )
      )}
    </>
  );
}
