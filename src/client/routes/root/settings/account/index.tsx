import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConversationAppBar } from "../../../../components/layout";
import { BaseItem } from "../../../../components/settings";
import useSnackbar from "../../../../components/useSnackbar";
import useBackend from "../../../../hooks/useBackend";
import useUser from "../../../../hooks/useUser";

export default function AccountSettingsRoute() {
  const { t } = useTranslation("settings");
  const { showSnackbar } = useSnackbar();
  const user = useUser();
  const backend = useBackend();
  const navigate = useNavigate();
  const handleLogOut = () => {
    backend
      .authLogOut()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        showSnackbar(t("error", { ns: "general" }));
      });
  };
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
              onClick={handleLogOut}
            >
              Log out
            </Button>
          }
        />
      </Grid>
    </>
  );
}
