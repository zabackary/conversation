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
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={<DrawerLists channels={channels} />}
    >
      {children}
    </ResponsiveDrawer>
  );
}
