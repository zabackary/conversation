import {
  Grid,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

export interface BaseItemProps {
  control: ReactNode;
  label: string;
  description: string;
  children?: ReactNode;
}

export default function BaseItem({
  control,
  label,
  description,
  children,
}: BaseItemProps) {
  return (
    <>
      <ListItem disablePadding sx={{ mb: children ? 0 : 2 }}>
        <ListItemText primary={label} secondary={description} />
        {control}
      </ListItem>
      {children ? (
        <ListItem disablePadding sx={{ mb: 2 }}>
          {children}
        </ListItem>
      ) : null}
    </>
  );
}
