import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  SxProps,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  MouseEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import {
  drawerWidth,
  toolbarButtonContext,
} from "./ConversationNavigationDrawer";
import { navigationRailWidth } from "./ConversationNavigationRail";

const closeOverflowFunctionContext = createContext(() => {
  // no-op
});

export function useCloseOverflowFunction() {
  return useContext(closeOverflowFunctionContext);
}

export interface ConversationAppBarProps {
  title: string;
  items?: ReactNode;
  overflowItems?: ReactNode;
  sx?: SxProps;
}
export default function ConversationAppBar({
  title,
  items,
  overflowItems,
  sx = {},
}: ConversationAppBarProps) {
  const toolbarButton = useContext(toolbarButtonContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuButtonId = useId();
  const menuId = useId();
  const menuOpen = !!menuAnchorEl;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutHeaderId = useId();
  const aboutDescriptionId = useId();
  const handleAboutMenu = () => {
    setAboutOpen(true);
    handleClose();
  };
  const { t } = useTranslation();
  const handleFeedback = () => {
    window.open(
      `mailto:${
        import.meta.env.CLIENT_FEEDBACK_EMAIL ?? ""
      }?subject=${encodeURIComponent(
        t("reportProblem.title")
      )}&body=${encodeURIComponent(t("reportProblem.body"))}`
    );
    handleClose();
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth + navigationRailWidth}px)` },
          ml: { sm: `${drawerWidth + navigationRailWidth}px` },
          ...sx,
        }}
      >
        <Toolbar>
          {toolbarButton}
          <Typography variant="h6" noWrap component="h1">
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { md: "flex" } }} />
          {items}
          <IconButton
            id={menuButtonId}
            aria-controls={menuOpen ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
            onClick={handleClick}
            size="large"
            edge="end"
          >
            <MaterialSymbolIcon icon="more_vert" />
          </IconButton>
          <Menu
            id={menuId}
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": menuButtonId,
              sx: { width: 180, maxWidth: "100%" },
            }}
          >
            <closeOverflowFunctionContext.Provider value={handleClose}>
              {overflowItems}
            </closeOverflowFunctionContext.Provider>
            {overflowItems ? <Divider /> : null}
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <MaterialSymbolIcon icon="help" />
              </ListItemIcon>
              {t("help")}
            </MenuItem>
            <MenuItem onClick={handleAboutMenu}>
              <ListItemIcon>
                <MaterialSymbolIcon icon="info" />
              </ListItemIcon>
              {t("about")}
            </MenuItem>
            <MenuItem onClick={handleFeedback}>
              <ListItemIcon>
                <MaterialSymbolIcon icon="bug_report" />
              </ListItemIcon>
              {t("reportProblem.title")}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        aria-labelledby={aboutHeaderId}
        aria-describedby={aboutDescriptionId}
      >
        <DialogTitle id={aboutHeaderId}>{t("aboutDialog.title")}</DialogTitle>
        <DialogContent>
          <div id={aboutDescriptionId}>
            <Stack alignItems="center" textAlign="center">
              <Avatar
                sx={{ bgcolor: "secondary.main", width: 72, height: 72 }}
                sizes="large"
              >
                [icon]
              </Avatar>
              <Typography variant="h5" my={2}>
                {t("aboutDialog.header")}
              </Typography>
              <Typography>{t("aboutDialog.copyright")}</Typography>
              <Typography>
                {t("aboutDialog.timestamp", {
                  version: __VERSION__,
                  revision: __COMMIT_HASH__,
                  date: new Date(__BUILD_TIMESTAMP__),
                })}
              </Typography>
            </Stack>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutOpen(false)} autoFocus>
            {t("done")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
