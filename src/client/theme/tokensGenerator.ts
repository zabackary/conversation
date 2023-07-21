import {
  DynamicScheme,
  Theme,
  argbFromHex,
  themeFromImage,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import getTokensFromDynamicScheme from "./getTokensFromDynamicScheme";

/**
 * Reproduced from  https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/variant.ts
 * Keep up to date.
 *
 * Set of themes supported by Dynamic Color.
 * Instantiate the corresponding subclass, ex. SchemeTonalSpot, to create
 * colors corresponding to the theme.
 */
export enum Variant {
  MONOCHROME,
  NEUTRAL,
  TONAL_SPOT,
  VIBRANT,
  EXPRESSIVE,
  FIDELITY,
  CONTENT,
  RAINBOW,
  FRUIT_SALAD,
}

function tokensFromTheme(theme: Theme) {
  const dynamicScheme = new DynamicScheme({
    sourceColorArgb: theme.source,
    variant: Variant.VIBRANT,
    contrastLevel: 0,
    isDark: true,
    primaryPalette: theme.palettes.primary,
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
