import { List, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { ConversationNavigationDrawer } from "../../../components/layout";
import LinkListItem from "../../../components/main/LinkListItem";

export default function SettingsRoute() {
  // TODO: Add accessible labels and switches via `inputProps`
  const {t} = useTranslation("settings");

  return (
    <ConversationNavigationDrawer
      drawerItems={
        <List>
          <LinkListItem primaryText={t("general.label")} to="/settings/" exclude={2} />
          <LinkListItem
            primaryText={t("behavior.label")}
            to="/settings/behavior/"
            exclude={2}
          />
          <LinkListItem
            primaryText={t("appearance.label")}
            to="/settings/appearance/"
            exclude={2}
          />
        </List>
      }
    >
      <Outlet />
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        v4.0.0-dev
      </Typography>
    </ConversationNavigationDrawer>
  );
}
