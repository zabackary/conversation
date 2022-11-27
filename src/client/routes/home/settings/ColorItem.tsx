import PaletteIcon from "@mui/icons-material/Palette";
import { Grid, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { MouseEvent, useId, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  initialValue: string;
  onChange: (newValue: string) => void;
  label: string;
  description: string;
}

export default function ColorItem({
  initialValue,
  onChange,
  label,
  description,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverId = useId();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? popoverId : undefined;
  return (
    <>
      <Grid item xs={8}>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: "right" }}>
        <Tooltip title="Open color palette">
          <IconButton onClick={handleClick} color="primary">
            <PaletteIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ sx: { padding: 2 } }}
      >
        <HexColorPicker color={value} onChange={handleChange} />
      </Popover>
    </>
  );
}
