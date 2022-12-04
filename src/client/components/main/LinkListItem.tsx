import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
} from "@mui/material";
import { ReactNode } from "react";
import { Link, useMatch } from "react-router-dom";

interface Props {
  primaryText?: string;
  secondaryText?: string;
  to?: string;
  icon?: ReactNode;
  loading?: boolean;
}
export default function LinkListItem(props: Props) {
  const { primaryText, secondaryText, to, icon, loading = false } = props;
  const match = useMatch(to || "guaranteed_no_match_pattern_79350bb67dbc59e7");

  return (
    <Box component="li" sx={{ margin: "8px" }}>
      <ListItem
        disablePadding
        component={loading ? "div" : Link}
        to={to}
        sx={{
          color: "inherit",
          textDecoration: "inherit",
        }}
      >
        {loading ? (
          <>
            <ListItemIcon>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <Stack spacing={4}>
              <Skeleton
                variant="rectangular"
                width={200}
                height="1.5rem"
                sx={{ margin: "4px 0" }}
              />
              <Skeleton variant="rectangular" width={200} height="0.75rem" />
            </Stack>
          </>
        ) : (
          <ListItemButton selected={!!match}>
            <ListItemIcon>{icon}</ListItemIcon>

            <ListItemText
              primary={primaryText}
              secondary={secondaryText}
              primaryTypographyProps={{
                sx: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
              secondaryTypographyProps={{
                variant: "caption",
                sx: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </ListItemButton>
        )}
      </ListItem>
    </Box>
  );
}
