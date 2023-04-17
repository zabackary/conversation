import { Box, List, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { ConversationNavigationDrawer } from "../../../components/layout";
import LinkListItem from "../../../components/main/LinkListItem";

export default function SettingsRoute() {
  // TODO: Add accessible labels and switches via `inputProps`
  const { t } = useTranslation("settings");

  return (
    <ConversationNavigationDrawer
      drawerItems={
        <List sx={{ m: 1 }}>
          <LinkListItem
            primaryText={t("general.label")}
            to="/app/settings/"
            exclude={2}
          />
          <LinkListItem
            primaryText={t("behavior.label")}
            to="/app/settings/behavior/"
            exclude={2}
          />
          <LinkListItem
            primaryText={t("appearance.label")}
            to="/app/settings/appearance/"
            exclude={2}
          />
          <LinkListItem
            primaryText="Account"
            to="/app/settings/account/"
            exclude={2}
          />
        </List>
      }
    >
      <Box p={3}>
        <Outlet />
        <Typography variant="body2" textAlign="center" mt={1}>
          v4.0.0-dev
        </Typography>
      </Box>
    </ConversationNavigationDrawer>
  );
}
