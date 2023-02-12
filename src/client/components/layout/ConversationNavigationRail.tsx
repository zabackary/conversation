import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ForumIcon from "@mui/icons-material/Forum";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  Paper,
} from "@mui/material";
import { ReactNode } from "react";
import { useLinkClickHandler, useMatches } from "react-router-dom";
import { NavigationRail, NavigationRailAction } from "../NavigationRail";

export const navigationRailWidth = 88 as const;

interface Route {
  label: string;
  href: string;
  icon: ReactNode;
  filledIcon: ReactNode;
  id: number;
}

const routes: Route[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeOutlinedIcon />,
    filledIcon: <HomeIcon />,
    id: 0,
  },
  {
    label: "DMs",
    href: "/dms",
    icon: <ChatBubbleOutlineOutlinedIcon />,
    filledIcon: <ChatBubbleIcon />,
    id: 1,
  },
  {
    label: "Channels",
    href: "/channels",
    icon: <ForumOutlinedIcon />,
    filledIcon: <ForumIcon />,
    id: 2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsOutlinedIcon />,
    filledIcon: <SettingsIcon />,
    id: 3,
  },
];

interface ConversationNavigationRailActionProps
  extends BottomNavigationActionProps {
  route: Route;
  rail?: boolean;
  selected?: boolean;
}

function ConversationNavigationRailAction({
  route,
  rail,
  selected,
  ...props
}: ConversationNavigationRailActionProps) {
  const handleClick = useLinkClickHandler(route.href);
  return rail ? (
    <NavigationRailAction
      label={route.label}
      icon={route.icon}
      value={route.id}
      component="a"
      // @ts-ignore This really does work. It's a bug in `styled()` I think
      onClick={handleClick}
      selected={selected}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  ) : (
    <BottomNavigationAction
      label={route.label}
      // TODO: Find a way where we can have the filled/outlined icon switch and
      // still have the up/down animation
      icon={route.icon}
      value={route.id}
      component="a"
      // @ts-ignore This really does work. It's a bug in `styled()` I think
      onClick={handleClick}
      selected={selected}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

export interface ConversationNavigationRailProps {
  mobile?: boolean;
}

export default function ConversationNavigationRail({
  mobile,
}: ConversationNavigationRailProps) {
  const matches = useMatches();
  const selected = routes.find((route) => route.href === matches[1].pathname);

  return mobile ? (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
      elevation={3}
    >
      <BottomNavigation value={selected?.id}>
        {routes.map((route) => (
          <ConversationNavigationRailAction key={route.id} route={route} />
        ))}
      </BottomNavigation>
    </Paper>
  ) : (
    <NavigationRail
      value={selected?.id}
      sx={{ paddingTop: "64px", position: "fixed", top: "0" }}
      showLabels
    >
      {routes.map((route) => (
        <ConversationNavigationRailAction key={route.id} route={route} rail />
      ))}
    </NavigationRail>
  );
}
