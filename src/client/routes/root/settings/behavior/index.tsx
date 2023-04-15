import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Chip, Grid, List, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ConversationAppBar } from "../../../../components/layout";
import { SwitchItem } from "../../../../components/settings";

export default function BehaviorSettingsRoute() {
  const { t } = useTranslation("settings");
  return (
    <>
      <ConversationAppBar title={t("behavior.title")} />
      <List>
        <SwitchItem
          value
          onChange={async (_newValue) => {
            // TODO: implement
          }}
          label={t("behavior.emojiclose.title")}
          description={t("behavior.emojiclose.description")}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<RestartAltIcon />}
              label={t("reset")}
              onClick={() => {
                // TODO: implement
              }}
              variant="outlined"
            />
          </Stack>
        </SwitchItem>
        <SwitchItem
          value
          onChange={async (_newValue) => {
            // TODO: implement
          }}
          label={t("behavior.sendenter.title")}
          description={t("behavior.sendenter.description")}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<RestartAltIcon />}
              label={t("reset")}
              onClick={() => {
                // TODO: implement
              }}
              variant="outlined"
            />
          </Stack>
        </SwitchItem>
      </List>
    </>
  );
}
