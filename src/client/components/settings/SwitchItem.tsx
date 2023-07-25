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
  disabled?: boolean;
}

export default function SwitchItem({
  value,
  onChange,
  label,
  description,
  children,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    onChange(e.currentTarget.checked)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        snackbar.showSnackbar("Failed to save preferences.");
      });
  };
  return (
    <BaseItem
      label={label}
      description={description}
      control={
        <Switch
          checked={value}
          onChange={handleChange}
          disabled={loading || disabled}
        />
      }
    >
      {children}
    </BaseItem>
  );
}
