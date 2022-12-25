import ChatIcon from "@mui/icons-material/Chat";
import ForumIcon from "@mui/icons-material/Forum";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { ReactNode, SyntheticEvent } from "react";
import { useLinkClickHandler, useMatches } from "react-router-dom";
import { NavigationRail, NavigationRailAction } from "../NavigationRail";

interface Route {
  label: string;
  href: string;
  icon: ReactNode;
  id: number;
}

const routes: Route[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon />,
    id: 0,
  },
  {
    label: "DMs",
    href: "/dms",
    icon: <ChatIcon />,
    id: 1,
  },
  {
    label: "Channels",
    href: "/channels",
    icon: <ForumIcon />,
    id: 2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
    id: 3,
  },
];

interface ConversationNavigationRailActionProps {
  route: Route;
  rail?: boolean;
}

function ConversationNavigationRailAction({
  route,
  rail,
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  ) : (
    <BottomNavigationAction
      label={route.label}
      icon={route.icon}
      value={route.id}
      component="a"
      onClick={handleClick}
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
  const handleActionClick = (
    _event: SyntheticEvent<Element, Event>,
    newSelected: unknown
  ) => {
    if (typeof newSelected === "number") {
      // setSelected(newSelected);
    }
  };

  return mobile ? (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
      elevation={3}
    >
      <BottomNavigation value={selected?.id} onChange={handleActionClick}>
        {routes.map((route) => (
          <ConversationNavigationRailAction key={route.id} route={route} />
        ))}
      </BottomNavigation>
    </Paper>
  ) : (
    <NavigationRail
      value={selected?.id}
      onChange={handleActionClick}
      sx={{ paddingTop: "64px", position: "sticky", top: "0" }}
    >
      {routes.map((route) => (
        <ConversationNavigationRailAction key={route.id} route={route} rail />
      ))}
    </NavigationRail>
  );
}
