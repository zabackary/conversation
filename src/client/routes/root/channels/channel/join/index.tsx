import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PasswordIcon from "@mui/icons-material/Password";
import PublicIcon from "@mui/icons-material/Public";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, SyntheticEvent, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../../../../components/LoadingButton";
import { ConversationAppBar } from "../../../../../components/layout";

export default function ChannelJoinScreen() {
  const [tab, setTab] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const handleTabChange =
    (panel: number) => (event: SyntheticEvent, isExpanded: boolean) => {
      if (!loading) setTab(isExpanded ? panel : null);
    };
  const handlePassphraseSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
  };
  const ids = [useId(), useId(), useId()];
  const { t } = useTranslation("channel");
  return (
    <>
      <ConversationAppBar
        title={t("join.title")}
      />
      <Accordion expanded={tab === 0} onChange={handleTabChange(0)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${ids[0]}-content`}
          id={`${ids[0]}-content`}
        >
          <Stack direction="row" alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
              <RecentActorsIcon />
            </Avatar>
            <Typography>{t("join.invite.label")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>[untranslated]This feature is in development.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={tab === 1} onChange={handleTabChange(1)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${ids[1]}-content`}
          id={`${ids[1]}-content`}
        >
          <Stack direction="row" alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
              <PasswordIcon />
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
                <LoadingButton variant="filled" type="submit" loading={loading}>
                  {t("join.joinButton")}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={tab === 2} onChange={handleTabChange(2)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${ids[2]}-content`}
          id={`${ids[2]}-content`}
        >
          <Stack direction="row" alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
              <PublicIcon />
            </Avatar>
            <Typography>{t("join.public.label")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            [untranslated] This feature is in development.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
