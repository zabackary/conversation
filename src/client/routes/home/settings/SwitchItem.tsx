import { Grid, Switch, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";

interface Props {
  initialValue: boolean;
  onChange: (newValue: boolean) => Promise<void>;
  label: string;
  description: string;
}

export default function SwitchItem({
  initialValue,
  onChange,
  label,
  description,
}: Props) {
  const [checked, setChecked] = useState(initialValue);
  const [disabled, setDisabled] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked);
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
        <Switch checked={checked} onChange={handleChange} disabled={disabled} />
      </Grid>
    </>
  );
}
