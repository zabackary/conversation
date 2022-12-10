import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

export const drawerWidth = 240;

const toolbarButtonContext = createContext<ReactNode | null>(null);

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
    <div>
      {drawerHeader}
      {drawerItems}
    </div>
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <toolbarButtonContext.Provider value={toolbarButton}>
          {children}
        </toolbarButtonContext.Provider>
      </Box>
    </Box>
  );
}

interface ConversationAppBarProps {
  title: string;
  items?: ReactNode[];
}
export function ConversationAppBar({ title, items }: ConversationAppBarProps) {
  const toolbarButton = useContext(toolbarButtonContext);
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        {toolbarButton}
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1, display: { md: "flex" } }} />
        {items}
      </Toolbar>
    </AppBar>
  );
}
