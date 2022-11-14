import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import React from "react";
import Channel from "../../../data/channel";
import User from "../../../data/user";
import ResponsiveDrawer from "../DrawerLayout";
import DrawerHeader from "./DrawerHeader";
import DrawerLists from "./DrawerLists";

interface Props {
  children?: React.ReactNode;
  user: User | null;
  channels: Channel[] | null;
}

export default function Main({ user, children, channels }: Props) {
  return (
    <ResponsiveDrawer
      toolbarTitle={<>Stuff</>}
      toolbarItems={
        <IconButton
          size="large"
          onClick={() => {
            /* TODO: Remove this or make it work */
          }}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
      }
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={<DrawerLists channels={channels} />}
    >
      {children}
    </ResponsiveDrawer>
  );
}
