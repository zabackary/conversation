import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useState } from "react";
import MaterialSymbolIcon from "../../../components/MaterialSymbolIcon";
import { ConversationAppBar } from "../../../components/layout";
import { ChannelList } from "../../../components/main";
import useBackend from "../../../hooks/useBackend";
import useDMs from "../../../hooks/useDMs";
import usePromise from "../../../hooks/usePromise";
import ChannelCard from "../channels/channel/join/ChannelCard";

export default function NoDmSelectedRoute() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const dms = useDMs();
  const backend = useBackend();
  const [refreshCount, setRefreshCount] = useState(0);
  const getInvitedChannels = useCallback(
    () => backend.getInvitedChannels(0, 20),
    // I want to run the promise every time refreshCount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backend, refreshCount]
  );
  const invitedChannels = usePromise(getInvitedChannels)?.filter(
    (value) => value.dm
  ); // TODO: Add paging
  const handleRefresh = () => {
    setRefreshCount((count) => count + 1);
  };
  const handleAccept = async (id: number) => {
    await backend.acceptInvite(id);
    handleRefresh();
  };
  const handleReject = async (id: number) => {
    await backend.deleteInvite(id);
    handleRefresh();
  };
  const surfaceColor = theme.palette.surfaceContainerLow.main;
  const isEmptyState = invitedChannels?.length === 0;
  return (
    <Stack justifyContent="center">
      {isMobile ? (
        <>
          <ConversationAppBar title="DMs" />
          <List>
            <ChannelList channels={dms} />
          </List>
        </>
      ) : (
        <Typography variant="h5" component="h2" mb={4} textAlign="center">
          Select a user to get started.
        </Typography>
      )}
      <Card
        sx={{ mx: 2, mb: isMobile ? 12 : 2 }}
        variant={isMobile ? "outlined" : undefined}
      >
        <CardHeader
          title="New requests"
          action={
            isMobile ? (
              <IconButton onClick={handleRefresh}>
                <MaterialSymbolIcon icon="refresh" />
              </IconButton>
            ) : (
              <Button
                variant="tonal"
                startIcon={<MaterialSymbolIcon icon="refresh" />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            )
          }
        />
        <CardContent>
          <Box
            sx={{
              position: "relative",
              "&::before, &::after": {
                position: "absolute",
                width: 16,
                top: 0,
                bottom: 0,
                content: '""',
                zIndex: 1,
              },
              "&::before": {
                left: 0,
                background: `linear-gradient(to right, ${
                  isMobile ? theme.palette.background.default : surfaceColor
                }, transparent)`,
              },
              "&::after": {
                right: 0,
                background: `linear-gradient(to left, ${
                  isMobile ? theme.palette.background.default : surfaceColor
                }, transparent)`,
              },
            }}
          >
            {isEmptyState ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  content: '""',
                  zIndex: 1,
                  left: 0,
                  minWidth: "50%",
                  background: `linear-gradient(to right, ${
                    isMobile ? theme.palette.background.default : surfaceColor
                  }, transparent)`,
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" mb={1}>
                  No new requests
                </Typography>
                <Typography>
                  It looks like you don&apos;t have any new DM requests at the
                  moment. Check back later!
                </Typography>
              </Box>
            ) : null}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                overflowX: isEmptyState || !invitedChannels ? "hidden" : "auto",
                opacity: isEmptyState ? 0.4 : 1,
                px: 2,
                pb: 2,
              }}
            >
              {isEmptyState || !invitedChannels
                ? new Array(14).fill(null).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <ChannelCard key={i} disablePulse={isEmptyState} />
                  ))
                : invitedChannels.map((invite) => (
                    <ChannelCard
                      key={invite.id}
                      invite={invite}
                      handleAccept={handleAccept}
                      handleReject={handleReject}
                    />
                  ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
