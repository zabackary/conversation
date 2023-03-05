import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";

export default function ChatInputActions() {
  const { t } = useTranslation("channel");
  return (
    <>
      <MenuItem>
        <ListItemIcon>
          <AttachFileIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={t("upload.title")}
          secondary={t("upload.hint")}
        />
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <AddPhotoAlternateIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={t("attach.title")}
          secondary={t("attach.hint")}
        />
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <PlayCircleOutlineIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={t("attach.title")}
          secondary={t("attach.hint")}
        />
      </MenuItem>
    </>
  );
}
