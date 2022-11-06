import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import React from "react";
import Channel from "../../../data/channel";
import User from "../../../data/user";
import ResponsiveDrawer from "../DrawerLayout";
import DrawerHeader from "./drawerHeader";
import DrawerLists from "./drawerLists";

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
        <DrawerLists channels={props.channels} loading={!props.channels} />
      }
    >
      {props.children}
    </ResponsiveDrawer>
  );
}
