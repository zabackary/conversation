import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { createContext, ReactNode, useCallback, useMemo } from "react";

export const drawerWidth = 240;

export const toolbarButtonContext = createContext<ReactNode | null>(null);

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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const drawer = (
    <>
      {drawerHeader}
      {drawerItems}
    </>
  );

  const toolbarButton = useMemo(
    () => (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
    ),
    [handleDrawerToggle]
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
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              width: drawerWidth,
              paddingTop: "64px",
              left: "unset",
            },
          }}
          sx={{
            display: { xs: "none", sm: "block" },
            position: "sticky",
            top: "0",
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" display="flex" flexDirection="column" flexGrow={1}>
        <Toolbar />
        <toolbarButtonContext.Provider value={toolbarButton}>
          {children}
        </toolbarButtonContext.Provider>
      </Box>
    </>
  );
}
