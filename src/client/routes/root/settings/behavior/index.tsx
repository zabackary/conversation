import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Chip, Grid, Stack } from "@mui/material";
import { ConversationAppBar } from "../../../../components/layout";
import { SwitchItem } from "../../../../components/settings";

export default function BehaviorSettingsRoute() {
  return (
    <>
      <ConversationAppBar title="Behavior settings" />
      <Grid container spacing={2}>
        <SwitchItem
          value
          onChange={async (_newValue) => {
            // TODO: implement
          }}
          label="Close emoji picker on select"
          description="When you select an emoji, the emoji picker will close automatically if this option is on. If you usually select multiple emoji at a time, disable this option."
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<RestartAltIcon />}
              label="Reset"
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
          label="Send on enter"
          description="Press Shift+Enter to insert a newline if this is selected. Otherwise, press Shift+Enter to send."
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<RestartAltIcon />}
              label="Reset"
              onClick={() => {
                // TODO: implement
              }}
              variant="outlined"
            />
          </Stack>
        </SwitchItem>
      </Grid>
    </>
  );
}
