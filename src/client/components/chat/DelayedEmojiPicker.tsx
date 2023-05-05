import EmojiPicker, {
  EmojiPickerData,
  EmojiPickerProps,
} from "@emoji-mart/react";
import {
  Box,
  CircularProgress,
  useTheme,
  darken,
  lighten,
} from "@mui/material";
import { useEffect, useState } from "react";
import useSnackbar from "../useSnackbar";

function parseColor(hexOrRgb: string) {
  const parsedHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexOrRgb);
  const parsedRgb = /^rgb\((\d+), (\d+), (\d+)\)/.exec(hexOrRgb);
  return parsedHex
    ? [
        parseInt(parsedHex[1], 16),
        parseInt(parsedHex[2], 16),
        parseInt(parsedHex[3], 16),
      ]
    : parsedRgb
    ? [
        parseInt(parsedRgb[1], 10),
        parseInt(parsedRgb[2], 10),
        parseInt(parsedRgb[3], 10),
      ]
    : (() => {
        throw new Error(
          `Invalid hex/rgb code (must not be shortened): ${hexOrRgb}`
        );
      })();
}

export interface DelayedEmojiPickerProps extends EmojiPickerProps {
  dataUrl: string;
}

export default function DelayedEmojiPicker({
  dataUrl,
  ...props
}: DelayedEmojiPickerProps) {
  const [data, setData] = useState<EmojiPickerData | null>(null);
  const snackbar = useSnackbar();
  useEffect(() => {
    fetch(dataUrl)
      .then((res) => res.json())
      .then((json) => {
        setData(json as EmojiPickerData);
      })
      .catch(() => {
        // TODO: translate
        snackbar.showSnackbar("Failed to load emoji picker");
      });
  }, [dataUrl, snackbar]);
  const theme = useTheme();
  return data ? (
    <Box
      sx={{
        "& em-emoji-picker": {
          "--rgb-background": parseColor(
            theme.palette.mode === "dark"
              ? darken(theme.palette.primary.main, 0.8)
              : lighten(theme.palette.primary.main, 0.9)
          ).join(", "),
          "--rgb-accent": parseColor(theme.palette.primary.main).join(", "),
          "--font-family": "inherit",
          "--border-radius": `${theme.shape.borderRadius}px`,
        },
      }}
    >
      <EmojiPicker
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        data={data}
        theme={theme.palette.mode}
        emojiButtonColors={[theme.palette.surfaceVariant.main]}
      />
    </Box>
  ) : (
    <Box
      sx={{
        width: "352px",
        height: "435px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
