import { Box, List, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ConversationAppBar } from "../../../components/layout";
import { ChannelList } from "../../../components/main";
import useDMs from "../../../hooks/useDMs";

export default function NoDmSelectedRoute() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const dms = useDMs();

  if (isMobile) {
    return (
      <>
        <ConversationAppBar title="DMs" />
        <List>
          <ChannelList channels={dms} />
        </List>
      </>
    );
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexGrow="1"
    >
      <Typography variant="h5" component="h2">
        Select a user to get started.
      </Typography>
    </Box>
  );
}
