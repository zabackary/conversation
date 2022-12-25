import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ConversationNavigationRail } from "../../components/layout";

export default function RootRoute() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Stack direction={isMobile ? "column" : "row"} height="100%">
      <ConversationNavigationRail mobile={isMobile} />
      <Outlet />
    </Stack>
  );
}
