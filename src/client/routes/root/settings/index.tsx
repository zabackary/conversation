import { List, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ConversationNavigationDrawer } from "../../../components/layout";
import LinkListItem from "../../../components/main/LinkListItem";

export default function SettingsRoute() {
  // TODO: Add accessible labels and switches via `inputProps`

  return (
    <ConversationNavigationDrawer
      drawerItems={
        <List>
          <LinkListItem primaryText="General" to="/settings/" exclude={2} />
          <LinkListItem
            primaryText="Behavior"
            to="/settings/behavior/"
            exclude={2}
          />
          <LinkListItem
            primaryText="Appearance"
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
