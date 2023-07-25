import {
  Box,
  Fab,
  List,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MaterialSymbolIcon from "../../../components/MaterialSymbolIcon";
import { ConversationAppBar } from "../../../components/layout";
import { ChannelList } from "../../../components/main";
import useChannels from "../../../hooks/useChannels";

export default function NoChannelSelectedRoute() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const channels = useChannels();
  const { t } = useTranslation("channel");

  if (isMobile) {
    return (
      <>
        <ConversationAppBar title={t("channels", { ns: "general" })} />
        <List sx={{ mb: 19 }}>
          <ChannelList channels={channels} />
        </List>
        <Fab
          variant="extended"
          color="primary"
          sx={{
            position: "fixed",
            bottom: { xs: 96, sm: 16 },
            right: 16,
            display: { sm: "none" },
          }}
          component={Link}
          to="join"
        >
          <MaterialSymbolIcon icon="group_add" sx={{ mr: 1 }} />
          {t("joinButton")}
        </Fab>
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
      <Stack>
        <Typography variant="h5" component="h2">
          Select a channel to get started.
        </Typography>
      </Stack>
    </Box>
  );
}
