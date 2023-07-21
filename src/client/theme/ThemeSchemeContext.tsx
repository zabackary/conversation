import {
  DynamicScheme,
  argbFromHex,
  hexFromArgb,
  themeFromImage,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { M3ColorTokens, M3ThemeScheme, M3ThemeTones } from "./M3Theme";
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

export interface ThemeSchemeContextType {
  themeScheme: M3ThemeScheme;
  generateThemeScheme: (base: string | HTMLImageElement) => Promise<void>;
  resetThemeScheme: () => void;
}

export const ThemeSchemeContext = createContext<ThemeSchemeContextType>({
  themeScheme: DEFAULT_M3_THEME_SCHEME,
  generateThemeScheme: (_base: unknown) => {
    return Promise.resolve();
  },
  resetThemeScheme: () => {
    // Default
  },
});

const THEME_SCHEME_KEY = "ThemeScheme";

interface ThemeSchemeProviderProps {
  children: ReactNode;
}
const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;
type Tone = (typeof TONES)[number];

function ThemeSchemeProvider({ children }: ThemeSchemeProviderProps) {
  const [themeScheme, setThemeScheme] = useState<M3ThemeScheme>(
    DEFAULT_M3_THEME_SCHEME
  );

  useEffect(() => {
    if (localStorage.getItem(THEME_SCHEME_KEY)) {
      const localThemeScheme = JSON.parse(
        localStorage.getItem(THEME_SCHEME_KEY) || "{}"
      ) as M3ThemeScheme; // Some years later, I will find this, but hopefully no one tampers
      setThemeScheme(localThemeScheme);
    }
  }, []);

  const themeSchemeValue = useMemo(
    () => ({
      themeScheme,
      async generateThemeScheme(base: string | HTMLImageElement) {
        let theme;
        if (typeof base === "string") {
          theme = themeFromSourceColor(argbFromHex(base));
        } else {
          theme = await themeFromImage(base);
        }
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
        const tokens = getTokensFromDynamicScheme(dynamicScheme);

        const paletteTones: Record<string, Record<Tone, string>> = {};

        for (const [key, palette] of Object.entries(theme.palettes)) {
          const tones: Partial<Record<Tone, string>> = {};
          for (const tone of TONES) {
            const color = hexFromArgb(palette.tone(tone));
            tones[tone] = color;
          }
          paletteTones[key] = tones as Record<Tone, string>;
        }
        const scheme: M3ThemeScheme = {
          light: Object.fromEntries(
            Object.entries(theme.schemes.light.toJSON()).map(([k, v]) => [
              k,
              hexFromArgb(v),
            ])
          ) as unknown as M3ColorTokens,
          dark: Object.fromEntries(
            Object.entries(theme.schemes.dark.toJSON()).map(([k, v]) => [
              k,
              hexFromArgb(v),
            ])
          ) as unknown as M3ColorTokens,
          tones: paletteTones as unknown as M3ThemeTones,
        };
        setThemeScheme(scheme);
        localStorage.setItem(THEME_SCHEME_KEY, JSON.stringify(scheme));
      },
      resetThemeScheme() {
        setThemeScheme(DEFAULT_M3_THEME_SCHEME);
        localStorage.setItem(
          THEME_SCHEME_KEY,
          JSON.stringify(DEFAULT_M3_THEME_SCHEME)
        );
      },
    }),
    [themeScheme]
  );

  return (
    <ThemeSchemeContext.Provider value={themeSchemeValue}>
      {children}
    </ThemeSchemeContext.Provider>
  );
}

export default ThemeSchemeProvider;
