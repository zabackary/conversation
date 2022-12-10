import React from "react";
import Channel from "../../../model/channel";
import User from "../../../model/user";
import ResponsiveDrawer from "../Layout";
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
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={<DrawerLists channels={channels} />}
    >
      {children}
    </ResponsiveDrawer>
  );
}
