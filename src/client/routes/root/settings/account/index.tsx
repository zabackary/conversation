import { Button, List, ListItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PrivilegeLevel } from "../../../../../model/user";
import MaterialSymbolIcon from "../../../../components/MaterialSymbolIcon";
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
  const handleContact = () => {
    window.open(
      `mailto:${import.meta.env.CLIENT_FEEDBACK_EMAIL ?? ""}`,
      "_blank"
    );
  };
  if (!user) return <>Logged out</>;
  return (
    <>
      <ConversationAppBar title="Account" />
      <List>
        <ListItem disableGutters>
          <Button
            variant="filled"
            startIcon={<MaterialSymbolIcon icon="logout" />}
            onClick={handleLogOut}
          >
            Log out
          </Button>
          <Button
            variant="tonal"
            startIcon={<MaterialSymbolIcon icon="mail" />}
            onClick={handleContact}
            sx={{ ml: 1 }}
          >
            {user.privilegeLevel === PrivilegeLevel.Unverified
              ? "Request verification"
              : "Request name change"}
          </Button>
        </ListItem>
        <BaseItem
          label={user.name}
          description={user.email ?? user.nickname ?? String(user.id)}
          control={null}
        />
      </List>
    </>
  );
}
