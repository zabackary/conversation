import LyricsOutlinedIcon from "@mui/icons-material/LyricsOutlined";
import {
  Box,
  List,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ConversationAppBar } from "../../../components/layout";
import { ChannelList } from "../../../components/main";
import useChannels from "../../../hooks/useChannels";

export default function NoChannelSelectedRoute() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const channels = useChannels();

  if (isMobile) {
    return (
      <>
        <ConversationAppBar title="Channels" />
        <List>
          <ChannelList channels={channels} />
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
      <Stack>
        <LyricsOutlinedIcon sx={{ fontSize: 80 }} />
        <Typography variant="h5" component="h2" ml="20px" mt="-20px">
          Select a channel to get started.
        </Typography>
      </Stack>
    </Box>
  );
}
