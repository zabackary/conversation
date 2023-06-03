import {
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { ReactNode, forwardRef } from "react";
import { Link, useMatches } from "react-router-dom";

export interface LinkListItemProps {
  primaryText?: string;
  secondaryText?: string;
  to?: string;
  icon?: ReactNode | ((selected: boolean) => ReactNode);
  avatar?: ReactNode;
  loading?: boolean;
  badge?: number;
  exclude?: number;
}
const LinkListItem = forwardRef<HTMLLIElement, LinkListItemProps>(
  (
    {
      primaryText,
      secondaryText,
      to,
      icon: dynamicIcon,
      loading = false,
      badge,
      avatar,
      exclude = 2,
    },
    ref
  ) => {
    const matches = useMatches().slice(exclude);
    const isMatch = matches.find((match) => match.pathname === to);
    const icon =
      typeof dynamicIcon === "function" ? dynamicIcon(!!isMatch) : dynamicIcon;

    return (
      <ListItem disablePadding sx={{ my: 0.5 }} ref={ref}>
        {loading || !to ? (
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
          <ListItemButton selected={!!isMatch} component={Link} to={to}>
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
    );
  }
);

export default LinkListItem;
