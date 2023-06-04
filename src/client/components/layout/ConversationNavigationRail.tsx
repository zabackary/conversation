import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  IconButton,
  Paper,
  styled,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLinkClickHandler, useMatches } from "react-router-dom";
import logoContent from "../../../assets/logo.svg?raw";
import { PrivilegeLevel } from "../../../model/user";
import useUser from "../../hooks/useUser";
import MaterialSymbolIcon, {
  MaterialSymbolIconProps,
} from "../MaterialSymbolIcon";
import { NavigationRail, NavigationRailAction } from "../NavigationRail";
import LanguagePickerDialog from "./LanguagePickerDialog";

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
  icon: MaterialSymbolIconProps["icon"];
  id: number;
  admin?: boolean;
}

const routes = [
  {
    label: "home" as const,
    href: "/app/",
    icon: "home",
    id: 0,
  },
  {
    label: "dms" as const,
    href: "/app/dms",
    icon: "chat",
    id: 1,
  },
  {
    label: "channels" as const,
    href: "/app/channels",
    icon: "forum",
    id: 2,
  },
  {
    label: "settings" as const,
    href: "/app/settings",
    icon: "settings",
    id: 3,
  },
  {
    label: "adminPanel" as const,
    href: "/app/admin",
    icon: "admin_panel_settings",
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
  if (route.admin && user?.privilegeLevel !== PrivilegeLevel.ADMIN) return null;
  return rail ? (
    <NavigationRailAction
      label={t(route.label)}
      icon={<MaterialSymbolIcon icon={route.icon} fill={selected} />}
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
      icon={<MaterialSymbolIcon icon={route.icon} fill={selected} />}
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
  const theme = useTheme();

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
          sx={{
            position: "fixed",
            top: "0",
            paddingTop: 8,
            backgroundPosition: "top 8px center",
            backgroundSize: `48px`,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              logoContent
                .replace("#f58b86", theme.palette.primary.main)
                .replace("#f37670", theme.palette.primary.contrastText)
                .replace("#fff", theme.palette.primary.contrastText)
            )}")`,
            backgroundRepeat: "no-repeat",
          }}
          showLabels
        >
          {routes.map((route) => (
            <ConversationNavigationRailAction
              key={route.id}
              route={route}
              rail
            />
          ))}
          <LanguageSwitcherIconButton
            size="large"
            onClick={handleClickOpen}
            aria-label="select language"
          >
            <MaterialSymbolIcon icon="translate" />
          </LanguageSwitcherIconButton>
        </NavigationRail>
      )}
      <LanguagePickerDialog open={languagePickerOpen} onClose={handleClose} />
    </>
  );
}
