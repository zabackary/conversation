import React from "react";
import useChannels from "../../hooks/useChannels";
import useUser from "../../hooks/useUser";
import ResponsiveDrawer from "../Layout";
import DrawerHeader from "./DrawerHeader";
import DrawerLists from "./DrawerLists";

interface Props {
  children?: React.ReactNode;
}

export default function Main({ children }: Props) {
  const user = useUser();
  const channels = useChannels();
  return (
    <ResponsiveDrawer
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={<DrawerLists channels={channels} />}
    >
      {children}
    </ResponsiveDrawer>
  );
}
