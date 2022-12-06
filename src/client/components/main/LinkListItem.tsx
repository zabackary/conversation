import {
  Badge,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { ReactNode } from "react";
import { Link, useMatch } from "react-router-dom";

interface Props {
  primaryText?: string;
  secondaryText?: string;
  to?: string;
  icon?: ReactNode;
  avatar?: ReactNode;
  loading?: boolean;
  badge?: number;
}
export default function LinkListItem({
  primaryText,
  secondaryText,
  to,
  icon,
  loading = false,
  badge,
  avatar,
}: Props) {
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
          <ListItemButton disabled sx={{ opacity: "1 !important" }}>
            <ListItemIcon>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>

            <ListItemText
              primary={<Skeleton />}
              secondary={<Skeleton />}
              primaryTypographyProps={{
                sx: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
                noWrap: true,
              }}
              secondaryTypographyProps={{
                variant: "caption",
                noWrap: true,
              }}
            />
          </ListItemButton>
        ) : (
          <ListItemButton selected={!!match}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            {avatar ? <ListItemAvatar>{avatar}</ListItemAvatar> : null}
            <ListItemText
              primary={primaryText}
              secondary={secondaryText}
              primaryTypographyProps={{
                noWrap: true,
              }}
              secondaryTypographyProps={{
                variant: "caption",
                noWrap: true,
              }}
              sx={{
                marginRight: badge ? 2 : undefined,
              }}
            />
            {badge ? (
              <Badge
                badgeContent={badge}
                color="primary"
                max={99}
                sx={{ marginRight: 1 }}
              />
            ) : null}
          </ListItemButton>
        )}
      </ListItem>
    </Box>
  );
}
