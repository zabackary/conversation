import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import Channel from "../../../data/channel";
import User from "../../../data/user";
import ResponsiveDrawer from "../DrawerLayout";
import DrawerHeader from "./drawerHeader";

interface Props {
  children?: React.ReactNode;
  user: User | null;
  channels: Channel[] | null;
}

export default function Main(props: Props) {
  return (
    <ResponsiveDrawer
      toolbarTitle={<>Stuff</>}
      toolbarItems={
        <IconButton size="large" onClick={() => {}} color="inherit">
          <AccountCircleIcon />
        </IconButton>
      }
      drawerHeader={<DrawerHeader user={props.user} />}
      drawerItems={
        props.channels ? (
          <>
            {props.channels.map((channel) => (
              <ListItem key={channel.id} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary={channel.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        ) : (
          <>Loading...</>
        )
      }
    >
      {props.children}
    </ResponsiveDrawer>
  );
}
