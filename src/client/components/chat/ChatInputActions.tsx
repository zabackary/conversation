import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";

export default function ChatInputActions() {
  return (
    <>
      <MenuItem>
        <ListItemIcon>
          <AttachFileIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Upload file"
          secondary={"You can also double-click the \u{1F53C}"}
        />
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <AddPhotoAlternateIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Attach image"
          secondary="You can also paste an image in the text field"
        />
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <PlayCircleOutlineIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Run action"
          secondary="You can also press / in the text field"
        />
      </MenuItem>
    </>
  );
}
