import {
  DynamicScheme,
  Theme,
  argbFromHex,
  themeFromImage,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import getTokensFromDynamicScheme from "./getTokensFromDynamicScheme";

function tokensFromTheme(theme: Theme) {
  const dynamicScheme = new DynamicScheme({
    sourceColorArgb: theme.source,
    variant: 0,
    primaryPalette: theme.palettes.primary,
    contrastLevel: 0,
    isDark: true,
    neutralPalette: theme.palettes.neutral,
    neutralVariantPalette: theme.palettes.neutralVariant,
    secondaryPalette: theme.palettes.secondary,
    tertiaryPalette: theme.palettes.tertiary,
  });
  return getTokensFromDynamicScheme(dynamicScheme);
}

export function generateTokensFromSourceColor(base: string) {
  return tokensFromTheme(themeFromSourceColor(argbFromHex(base)));
}

export async function generateTokensFromImage(base: HTMLImageElement) {
  return tokensFromTheme(await themeFromImage(base));
}

export default async function generateTokens(base: string | HTMLImageElement) {
  if (typeof base === "string") {
    return generateTokensFromSourceColor(base);
  }
  return generateTokensFromImage(base);
}
