import { Switch } from "@mui/material";
import { ChangeEvent, ReactNode, useState } from "react";
import useSnackbar from "../useSnackbar";
import BaseItem from "./BaseItem";

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
  const snackbar = useSnackbar();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisabled(true);
    onChange(e.currentTarget.checked)
      .then(() => {
        setDisabled(false);
      })
      .catch(() => {
        setDisabled(false);
        snackbar.showSnackbar("Failed to save preferences.");
      });
  };
  return (
    <BaseItem
      label={label}
      description={description}
      control={
        <Switch checked={value} onChange={handleChange} disabled={disabled} />
      }
    >
      {children}
    </BaseItem>
  );
}
