import PaletteIcon from "@mui/icons-material/Palette";
import { Grid, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { MouseEvent, ReactNode, useId, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
  description: string;
  children?: ReactNode;
}

export default function ColorItem({
  value,
  onChange,
  label,
  description,
  children,
}: Props) {
  const handleChange = (newValue: string) => {
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
          <IconButton
            onClick={handleClick}
            color="primary"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.main" },
            }}
          >
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
      {children ? (
        <Grid item xs={12}>
          {children}
        </Grid>
      ) : null}
    </>
  );
}
