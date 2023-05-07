import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import MaterialSymbolIcon from "../MaterialSymbolIcon";

export default function ChatInputActions() {
  const { t } = useTranslation("channel");
  return (
    <>
      <MenuItem>
        <ListItemIcon>
          <MaterialSymbolIcon icon="upload" />
        </ListItemIcon>
        <ListItemText
          primary={t("upload.title")}
          secondary={t("upload.hint")}
        />
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <MaterialSymbolIcon icon="add_a_photo" />
        </ListItemIcon>
        <ListItemText
          primary={t("attach.title")}
          secondary={t("attach.hint")}
        />
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <MaterialSymbolIcon icon="flag" />
        </ListItemIcon>
        <ListItemText
          primary={t("action.title")}
          secondary={t("action.hint")}
        />
      </MenuItem>
    </>
  );
}
