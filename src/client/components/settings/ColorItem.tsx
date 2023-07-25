import { IconButton, Popover, Tooltip } from "@mui/material";
import { MouseEvent, ReactNode, useEffect, useId, useState } from "react";
import { HexColorPicker } from "react-colorful";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import BaseItem from "./BaseItem";

interface Props {
  value?: string;
  initialValue?: string;
  onChange: (newValue: string) => void;
  label: string;
  description: string;
  children?: ReactNode;
}

export default function ColorItem({
  value,
  initialValue,
  onChange,
  label,
  description,
  children,
}: Props) {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const handleChange = (newValue: string) => {
    onChange(newValue);
    setCurrentValue(newValue);
  };
  useEffect(() => {
    if (value !== undefined) setCurrentValue(value);
  }, [value]);
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
      <BaseItem
        label={label}
        description={description}
        control={
          <Tooltip title="Open color palette">
            <IconButton
              onClick={handleClick}
              sx={{
                bgcolor: "secondaryContainer.main",
                color: "secondaryContainer.contrastText",
                "&:hover": { bgcolor: "secondaryContainer.main" },
              }}
            >
              <MaterialSymbolIcon icon="palette" fill={open} />
            </IconButton>
          </Tooltip>
        }
      >
        {children}
      </BaseItem>
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
        slotProps={{
          paper: {
            sx: {
              padding: 2,
              "& .react-colorful": {
                height: "auto",
                cursor: "pointer",
                "& .react-colorful__saturation": {
                  display: "none",
                },
                "& .react-colorful__hue": {
                  height: "36px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    width: "18px",
                    height: "100%",
                    display: "block",
                    background: "#f00",
                  },
                  "& .react-colorful__interactive": {
                    left: "18px",
                    borderRadius: 0,
                    background:
                      "linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)",
                  },
                  ".react-colorful__interactive:focus .react-colorful__pointer":
                    {
                      transform: "translate(-50%, -50%)",
                    },
                  "& .react-colorful__hue-pointer": {
                    height: "36px",
                    width: "36px",
                    background: "none",
                    boxShadow: "none",
                    border: 0,
                    "& .react-colorful__pointer-fill": {
                      display: "none",
                    },
                    "&::after": {
                      content: '""',
                      top: "-1px",
                      position: "absolute",
                      width: "9999px",
                      height: "calc(100% + 1px)",
                      background: `radial-gradient(
                      circle at 0% 50%,
                      transparent 18px,
                      rgba(0, 0, 0, 50%) 18px
                    )`,
                      zIndex: "0",
                    },
                  },
                },
              },
            },
          },
        }}
      >
        <HexColorPicker color={currentValue} onChange={handleChange} />
      </Popover>
    </>
  );
}
