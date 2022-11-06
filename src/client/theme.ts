import { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: "#1E90FF",
    },
    secondary: {
      main: "#045BB3",
    },
  },
});
