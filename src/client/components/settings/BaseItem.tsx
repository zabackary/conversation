import { Grid, Typography } from "@mui/material";
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
      <Grid item xs>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Grid>
      <Grid item>{control}</Grid>
      {children ? (
        <Grid item xs={12}>
          {children}
        </Grid>
      ) : null}
    </>
  );
}
