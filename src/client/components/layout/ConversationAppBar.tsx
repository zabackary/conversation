import { AppBar, Box, SxProps, Toolbar, Typography } from "@mui/material";
import { ReactNode, useContext } from "react";
import {
  drawerWidth,
  toolbarButtonContext,
} from "./ConversationNavigationDrawer";

export interface ConversationAppBarProps {
  title: string;
  items?: ReactNode[];
  sx?: SxProps;
}
export default function ConversationAppBar({
  title,
  items,
  sx = {},
}: ConversationAppBarProps) {
  const toolbarButton = useContext(toolbarButtonContext);
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth + 88}px)` },
        ml: { sm: `${drawerWidth + 88}px` },
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
      </Toolbar>
    </AppBar>
  );
}
