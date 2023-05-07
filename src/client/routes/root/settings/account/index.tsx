import { Button, List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConversationAppBar } from "../../../../components/layout";
import { BaseItem } from "../../../../components/settings";
import useSnackbar from "../../../../components/useSnackbar";
import useBackend from "../../../../hooks/useBackend";
import useUser from "../../../../hooks/useUser";
import MaterialSymbolIcon from "../../../../components/MaterialSymbolIcon";

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
      <List>
        <BaseItem
          label={user.name}
          description={user.email ?? user.nickname ?? String(user.id)}
          control={
            <Button
              variant="tonal"
              startIcon={<MaterialSymbolIcon icon="logout" />}
              onClick={handleLogOut}
            >
              Log out
            </Button>
          }
        />
      </List>
    </>
  );
}
