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
      }?subject=Conversation+`,
      "_blank"
    );
  };
  const [profileUploadTarget, setProfileUploadTarget] =
    useState<HTMLElement | null>(null);
  const onChangeProfilePicture: MouseEventHandler<HTMLDivElement> = (e) => {
    setProfileUploadTarget(e.currentTarget);
  };
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
            console.log("selected:", result);
          }}
        />
      </Popover>
      <ConversationAppBar
        title="Account"
        items={
          <>
            <Button
              variant="filled"
              startIcon={<MaterialSymbolIcon icon="logout" />}
              onClick={handleLogOut}
              sx={{ mr: 1 }}
            >
              Log out
            </Button>
            {user.privilegeLevel === PrivilegeLevel.Unverified ? (
              <Button
                variant="tonal"
                startIcon={<MaterialSymbolIcon icon="mail" />}
                onClick={handleContact}
                sx={{ ml: 1, mr: 1 }}
              >
                Request verification
              </Button>
            ) : null}
          </>
        }
      />
      <List>
        <ListItem>
          <Alert variant="outlined" severity="info">
            Changing any field will result in your account being marked as
            unverified until an admin can confirm your account.
          </Alert>
        </ListItem>
        <ListSubheader>Account</ListSubheader>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemText primary="Name" secondary={user.name} />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemText
              primary="Email"
              secondary={user.email ?? "No email"}
            />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListSubheader>Profile</ListSubheader>
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
              primary="Nickname"
              secondary={user.nickname ?? "Unset"}
            />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton onClick={onChangeProfilePicture}>
            <ListItemText primary="Profile picture" />
            <ListItemSecondaryAction>
              <MaterialSymbolIcon icon="edit" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListSubheader>Social OAuth Providers</ListSubheader>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemIcon>
              <MaterialSymbolIcon icon="add" />
            </ListItemIcon>
            <ListItemText primary="Add provider" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
