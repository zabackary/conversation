import { Grid, Switch, Typography } from "@mui/material";
import { ChangeEvent, ReactNode, useState } from "react";

interface Props {
  value: boolean;
  onChange: (newValue: boolean) => Promise<void>;
  label: string;
  description: string;
  children?: ReactNode;
}

export default function SwitchItem({
  value,
  onChange,
  label,
  description,
  children,
}: Props) {
  const [disabled, setDisabled] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisabled(true);
    onChange(e.currentTarget.checked).then(() => {
      setDisabled(false);
    });
  };
  return (
    <>
      <Grid item xs={8}>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: "right" }}>
        <Switch checked={value} onChange={handleChange} disabled={disabled} />
      </Grid>
      {children ? (
        <Grid item xs={12}>
          {children}
        </Grid>
      ) : null}
    </>
  );
}
