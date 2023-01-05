import { Grow, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import { ConversationNavigationRail } from "../../components/layout";

export default function RootRoute() {
  const [, match] = useMatches();
  const currentOutlet = useOutlet();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Stack direction={isMobile ? "column" : "row"} height="100%">
      <ConversationNavigationRail mobile={isMobile} />
      <SwitchTransition>
        <Grow key={match.id} timeout={200} unmountOnExit>
          <Stack direction={isMobile ? "column" : "row"} height="100%">
            {currentOutlet}
          </Stack>
        </Grow>
      </SwitchTransition>
    </Stack>
  );
}
