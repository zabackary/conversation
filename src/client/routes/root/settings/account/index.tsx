import {
  Alert,
  Button,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Popover,
} from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PrivilegeLevel } from "../../../../../model/user";
import ImagePicker from "../../../../components/ImagePicker";
import MaterialSymbolIcon from "../../../../components/MaterialSymbolIcon";
import UserTooltip from "../../../../components/UserTooltip";
import { ConversationAppBar } from "../../../../components/layout";
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
      `mailto:${
        import.meta.env.CLIENT_FEEDBACK_EMAIL ?? ""
      }?subject=Conversation+request+for+verification`,
      "_blank"
    );
  };
  const [profileUploadTarget, setProfileUploadTarget] =
    useState<HTMLElement | null>(null);
  const onChangeProfilePicture: MouseEventHandler<HTMLDivElement> = (e) => {
    setProfileUploadTarget(e.currentTarget);
  };
  // TODO: Translate
  if (!user) return <>Logged out</>;
  return (
    <>
      <Popover
        open={!!profileUploadTarget}
        anchorEl={profileUploadTarget}
        onClose={() => setProfileUploadTarget(null)}
      >
        <ImagePicker
          allowFiles
          onImageSelected={(result) => {
            setProfileUploadTarget(null);
            console.log("selected:", result);
          }}
        />
      </Popover>
      <ConversationAppBar
        title={t("account.title")}
        items={
          <>
            <Button
              variant="filled"
              startIcon={<MaterialSymbolIcon icon="logout" />}
              onClick={handleLogOut}
              sx={{ mr: 1 }}
            >
              {t("account.logout.action")}
            </Button>
            {user.privilegeLevel === PrivilegeLevel.Unverified ? (
              <Button
                variant="tonal"
                startIcon={<MaterialSymbolIcon icon="mail" />}
                onClick={handleContact}
                sx={{ ml: 1, mr: 1 }}
              >
                {t("account.requestVerification")}
              </Button>
            ) : null}
          </>
        }
      />
      <List>
        <ListItem>
          <Alert variant="outlined" severity="info" sx={{ width: "100%" }}>
            {t("account.infoBubble")}
          </Alert>
        </ListItem>
        <ListSubheader>{t("account.subheader.account")}</ListSubheader>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemText
              primary={t("account.name.title")}
              secondary={user.name}
            />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemText
              primary={t("account.email.title")}
              secondary={user.email}
            />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListSubheader>{t("account.subheader.profile")}</ListSubheader>
        <ListItem>
          <Card>
            <UserTooltip
              user={user}
              disabled
              onChangeProfilePicture={onChangeProfilePicture}
            />
          </Card>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemText
              primary={t("account.nickname.title")}
              secondary={user.nickname}
            />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton onClick={onChangeProfilePicture}>
            <ListItemText
              primary={t("account.profilePicture.title")}
              secondary={t("account.profilePicture.description")}
            />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListSubheader>{t("account.subheader.oauth")}</ListSubheader>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemIcon>
              <MaterialSymbolIcon icon="add" />
            </ListItemIcon>
            <ListItemText primary={t("account.oauth.add")} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
