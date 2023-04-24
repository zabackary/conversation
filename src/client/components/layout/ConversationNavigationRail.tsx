import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ForumIcon from "@mui/icons-material/Forum";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  IconButton,
  Paper,
  styled,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLinkClickHandler, useMatches } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { NavigationRail, NavigationRailAction } from "../NavigationRail";
import LanguagePickerDialog from "./LanguagePickerDialog";
import useUser from "../../hooks/useUser";
import { PrivilegeLevel } from "../../../model/user";

const LanguageSwitcherIconButton = styled(IconButton, {
  shouldForwardProp(propName) {
    return propName !== "showLabel";
  },
})(() => ({
  margin: "auto auto 12px auto",
}));

export const navigationRailWidth = 88 as const;

interface Route {
  label: string;
  href: string;
  icon: ReactNode;
  filledIcon: ReactNode;
  id: number;
  admin?: boolean;
}

const routes = [
  {
    label: "home" as const,
    href: "/app/",
    icon: <HomeOutlinedIcon />,
    filledIcon: <HomeIcon />,
    id: 0,
  },
  {
    label: "dms" as const,
    href: "/app/dms",
    icon: <ChatBubbleOutlineOutlinedIcon />,
    filledIcon: <ChatBubbleIcon />,
    id: 1,
  },
  {
    label: "channels" as const,
    href: "/app/channels",
    icon: <ForumOutlinedIcon />,
    filledIcon: <ForumIcon />,
    id: 2,
  },
  {
    label: "settings" as const,
    href: "/app/settings",
    icon: <SettingsOutlinedIcon />,
    filledIcon: <SettingsIcon />,
    id: 3,
  },
  {
    label: "adminPanel" as const,
    href: "/app/admin",
    icon: <AdminPanelSettingsOutlinedIcon />,
    filledIcon: <AdminPanelSettingsIcon />,
    id: 4,
    admin: true,
  },
] satisfies Route[];

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

interface ConversationNavigationRailActionProps
  extends BottomNavigationActionProps {
  route: ArrayElement<typeof routes>;
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
  const { t } = useTranslation();
  const user = useUser(false);
  if (route.admin && user?.privilegeLevel !== PrivilegeLevel.Admin) return null;
  return rail ? (
    <NavigationRailAction
      label={t(route.label)}
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
      label={t(route.label)}
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
  const selected = routes.find((route) => route.href === matches[1]?.pathname);
  const { i18n } = useTranslation();
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const handleClickOpen = () => {
    setLanguagePickerOpen(true);
  };
  const handleClose = (value?: string) => {
    setLanguagePickerOpen(false);
    if (value) void i18n.changeLanguage(value);
  };

  return (
    <>
      {mobile ? (
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
            <ConversationNavigationRailAction
              key={route.id}
              route={route}
              rail
            />
          ))}
          <LanguageSwitcherIconButton size="large" onClick={handleClickOpen}>
            <TranslateIcon />
          </LanguageSwitcherIconButton>
        </NavigationRail>
      )}
      <LanguagePickerDialog open={languagePickerOpen} onClose={handleClose} />
    </>
  );
}
