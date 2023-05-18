import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import { navigationRailWidth } from "./ConversationNavigationRail";

export const drawerWidth = 240;

export const toolbarButtonContext = createContext<ReactNode | null>(null);

const LISTS = ["/app/channels", "/app/dms", "/app/settings"];

interface Props {
  /**
   * The children contained in the drawer layout.
   */
  children?: React.ReactNode;
  drawerHeader?: React.ReactNode;
  drawerItems?: React.ReactNode;
}

export default function ResponsiveDrawer({
  children,
  drawerHeader,
  drawerItems,
}: Props) {
  const navigate = useNavigate();
  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  const location = useLocation();
  const toolbarButton = useMemo(
    () => (
      <IconButton
        color="inherit"
        aria-label="back" // TODO: translate
        edge="start"
        onClick={handleBackClick}
        sx={{
          mr: 1,
          display: !LISTS.includes(
            location.pathname.slice(
              0,
              location.pathname.endsWith("/") ? -1 : undefined
            )
          )
            ? { sm: "none" }
            : "none",
        }}
      >
        <MaterialSymbolIcon icon="arrow_back" />
      </IconButton>
    ),
    [handleBackClick, location.pathname]
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          display: "flex",
        }}
      >
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              width: drawerWidth,
              paddingTop: "64px",
              left: "unset",
              zIndex: "unset",
            },
          }}
          sx={{
            display: { xs: "none", sm: "block" },
            position: "sticky",
            top: "0",
          }}
          open
        >
          {drawerHeader}
          {drawerItems}
        </Drawer>
      </Box>
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        width={{ sm: `calc(100% - ${drawerWidth + navigationRailWidth}px)` }}
      >
        <Toolbar />
        <toolbarButtonContext.Provider value={toolbarButton}>
          {children}
        </toolbarButtonContext.Provider>
      </Box>
    </>
  );
}
