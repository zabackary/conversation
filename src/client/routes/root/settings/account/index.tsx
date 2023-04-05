import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ConversationAppBar } from "../../../../components/layout";
import { BaseItem } from "../../../../components/settings";
import useBackend from "../../../../hooks/useBackend";
import useUser from "../../../../hooks/useUser";

export default function AccountSettingsRoute() {
  const { t } = useTranslation("settings");
  const user = useUser();
  const backend = useBackend();
  if (!user) return <>Logged out</>;
  return (
    <>
      <ConversationAppBar title="Account" />
      <Grid container spacing={2}>
        <BaseItem
          label={user.name}
          description={user.email ?? user.nickname ?? String(user.id)}
          control={
            <Button
              variant="tonal"
              startIcon={<LogoutIcon />}
              onClick={() => void backend.authLogOut()}
            >
              Log out
            </Button>
          }
        />
      </Grid>
    </>
  );
}
