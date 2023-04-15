import React, { useContext, useMemo } from "react";

import { CssBaseline, responsiveFontSizes } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { ThemeModeContext } from "../context/ThemeModeContext";
import { ThemeSchemeContext } from "../context/ThemeSchemeContext";
import { getDesignTokens, getThemedComponents } from "./M3Theme";

export interface M3ThemeProps {
  children: React.ReactNode;
}

export default function M3ThemeProvider({ children }: M3ThemeProps) {
  const { themeMode } = useContext(ThemeModeContext);
  const { themeScheme } = useContext(ThemeSchemeContext);

  const m3Theme = useMemo(() => {
    const designTokens = getDesignTokens(
      themeMode,
      themeScheme[themeMode],
      themeScheme.tones,
      {
        body: [
          '"Roboto Flex"',
          "Roboto",
          "Arial",
          '"Noto Color Emoji"',
          "sans-serif",
        ].join(","),
        heading: [
          '"Roboto Flex"',
          "Roboto",
          "Arial",
          '"Noto Color Emoji"',
          "sans-serif",
        ].join(","),
      }
    );
    let newM3Theme = createTheme(designTokens);
    newM3Theme = deepmerge(newM3Theme, getThemedComponents(newM3Theme));
    newM3Theme = responsiveFontSizes(newM3Theme);

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeScheme[themeMode].surface);

    return newM3Theme;
  }, [themeMode, themeScheme]);

  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
