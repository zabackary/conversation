import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Dialog,
  Fab,
  Grid,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FormEvent, SyntheticEvent, useCallback, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../../../../components/LoadingButton";
import MaterialSymbolIcon from "../../../../../components/MaterialSymbolIcon";
import { ConversationAppBar } from "../../../../../components/layout";
import useBackend from "../../../../../hooks/useBackend";
import usePromise from "../../../../../hooks/usePromise";
import ChannelCard from "./ChannelCard";
import Create from "./create";

export default function ChannelJoinScreen() {
  const [tab, setTab] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const handleTabChange =
    (panel: number) => (event: SyntheticEvent, isExpanded: boolean) => {
      if (!loading) setTab(isExpanded ? panel : null);
    };
  const handlePassphraseSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
  };
  const ids = [useId(), useId(), useId()] as const;
  const { t } = useTranslation("channel");
  const [createOpen, setCreateOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const backend = useBackend();
  const [refreshCount, setRefreshCount] = useState(0);
  const getInvitedChannels = useCallback(
    () => backend.getInvitedChannels(0, 20),
    // I want to run the promise every time refreshCount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backend, refreshCount]
  );
  const invitedChannels = usePromise(getInvitedChannels)?.filter(
    (value) => !value.dm
  ); // TODO: Add paging
  const getPublicChannels = useCallback(
    () => backend.getPublicChannels(0, 20),
    // I want to run the promise every time refreshCount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backend, refreshCount]
  );
  const publicChannels = usePromise(getPublicChannels); // TODO: Add paging
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
  return (
    <>
      <ConversationAppBar
        title={t("join.title")}
        items={
          <Button
            sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
            variant="tonal"
            size="large"
            onClick={() => setCreateOpen(true)}
            startIcon={<MaterialSymbolIcon icon="group_add" />}
          >
            {t("createChannel")}
          </Button>
        }
        overflowItems={
          <MenuItem onClick={handleRefresh}>
            <ListItemIcon>
              <MaterialSymbolIcon icon="refresh" />
            </ListItemIcon>
            Refresh
          </MenuItem>
        }
      />
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { sm: "none" },
        }}
        color="primary"
        onClick={() => setCreateOpen(true)}
      >
        <MaterialSymbolIcon icon="group_add" sx={{ mr: 1 }} />
        {t("createChannel")}
      </Fab>
      <Box m={3}>
        <Dialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          fullScreen={fullScreen}
        >
          <Create onClose={() => setCreateOpen(false)} />
        </Dialog>
        <Accordion
          expanded={tab === 0}
          onChange={handleTabChange(0)}
          variant="filled"
        >
          <AccordionSummary
            expandIcon={<MaterialSymbolIcon icon="expand_more" />}
            aria-controls={`${ids[0]}-content`}
            id={`${ids[0]}-content`}
          >
            <Stack direction="row" alignItems="center">
              <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                <MaterialSymbolIcon icon="diversity_3" />
              </Avatar>
              <Typography>{t("join.invite.label")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
            >
              {invitedChannels ? (
                invitedChannels.length > 0 ? (
                  invitedChannels.map((invite) => (
                    <ChannelCard
                      invite={invite}
                      key={invite.id}
                      handleAccept={handleAccept}
                      handleReject={handleReject}
                    />
                  ))
                ) : (
                  <Stack direction="row" spacing={1}>
                    <MaterialSymbolIcon icon="music_note" />
                    {/* TODO: translate */}
                    <Typography>Nothing here, move along</Typography>
                  </Stack>
                )
              ) : (
                new Array(4)
                  .fill(null)
                  // eslint-disable-next-line react/no-array-index-key
                  .map((_, i) => <ChannelCard key={i} />)
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={tab === 1}
          onChange={handleTabChange(1)}
          variant="filled"
        >
          <AccordionSummary
            expandIcon={<MaterialSymbolIcon icon="expand_more" />}
            aria-controls={`${ids[1]}-content`}
            id={`${ids[1]}-content`}
          >
            <Stack direction="row" alignItems="center">
              <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                <MaterialSymbolIcon icon="key" />
              </Avatar>
              <Typography>{t("join.passphrase.label")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={handlePassphraseSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>{t("join.passphrase.hint")}</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    label={t("join.passphrase.id")}
                  />
                </Grid>
                <Grid item xs>
                  <TextField fullWidth label={t("join.passphrase.password")} />
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    variant="filled"
                    type="submit"
                    loading={loading}
                  >
                    {t("join.joinButton")}
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={tab === 2}
          onChange={handleTabChange(2)}
          variant="filled"
        >
          <AccordionSummary
            expandIcon={<MaterialSymbolIcon icon="expand_more" />}
            aria-controls={`${ids[2]}-content`}
            id={`${ids[2]}-content`}
          >
            <Stack direction="row" alignItems="center">
              <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                <MaterialSymbolIcon icon="public" />
              </Avatar>
              <Typography>{t("join.public.label")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
            >
              {publicChannels ? (
                publicChannels.length > 0 ? (
                  publicChannels
                    .sort((invite) => (invite.name === "Main Channel" ? -1 : 0))
                    .map((invite) => (
                      <ChannelCard
                        invite={invite}
                        key={invite.id}
                        handleAccept={handleAccept}
                      />
                    ))
                ) : (
                  <Stack direction="row" spacing={1}>
                    <MaterialSymbolIcon icon="music_note" />
                    {/* TODO: translate */}
                    <Typography>No new public channels for you</Typography>
                  </Stack>
                )
              ) : (
                new Array(4)
                  .fill(null)
                  // eslint-disable-next-line react/no-array-index-key
                  .map((_, i) => <ChannelCard key={i} />)
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}
