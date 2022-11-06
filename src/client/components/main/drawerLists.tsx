import SortIcon from "@mui/icons-material/Sort";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useId } from "react";
import { Link, useLocation } from "react-router-dom";
import Channel from "../../../data/channel";
import ChannelList from "./drawerItems";

interface Props {
  channels?: Channel[] | null;
  loading: boolean;
}

export default function DrawerLists(props: Props) {
  const { channels, loading } = props;
  const channelListId = useId();
  const settingsListId = useId();
  const { pathname: path } = useLocation();

  return (
    <>
      <List
        aria-labelledby={channelListId}
        subheader={
          <ListSubheader component="div" id={channelListId}>
            Channels
          </ListSubheader>
        }
      >
        <ChannelList channels={channels} />
      </List>
      <Divider />
      <List
        aria-labelledby={settingsListId}
        subheader={
          <ListSubheader component="div" id={settingsListId}>
            Settings
          </ListSubheader>
        }
      >
        <Box
          component="li"
          sx={{ display: "block", margin: "8px", borderRadius: "4px" }}
        >
          <ListItem
            disablePadding
            component={Link}
            to="/settings/channels"
            sx={{
              color: "inherit",
              textDecoration: "inherit",
            }}
          >
            <ListItemButton
              selected={path === `/settings/channels`}
              sx={{ borderRadius: "8px" }}
            >
              <ListItemIcon>
                <SortIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    color:
                      path === `/settings/channels`
                        ? "primary.dark"
                        : "inherit",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                primary="Manage Channels"
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </List>
    </>
  );
}
