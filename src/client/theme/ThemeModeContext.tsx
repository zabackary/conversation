import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { M3ThemeMode } from "./M3Theme";

export interface ThemeModeContextType {
  themeMode: M3ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: M3ThemeMode) => void;
  resetThemeMode: () => void;
}

export const DEFAULT_THEME_MODE: M3ThemeMode = "dark";
export const DEFAULT_THEME_SOURCE_COLOR = "#efa0ff";
export const DEFAULT_THEME_SCHEME = undefined;
const THEME_MODE_KEY = "ThemeMode";

export const ThemeModeContext = createContext<ThemeModeContextType>({
  themeMode: DEFAULT_THEME_MODE,
  toggleThemeMode: () => {
    // Noop for default
  },
  setThemeMode(_mode) {
    // Noop for default
  },
  resetThemeMode: () => {
    // Noop for default
  },
});

interface ThemeModeProviderProps {
  children: ReactNode;
}
function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [themeMode, setThemeMode] = useState<M3ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    if (localStorage.getItem(THEME_MODE_KEY)) {
      const localMode = JSON.parse(
        localStorage.getItem(THEME_MODE_KEY) || "{}"
      ) as unknown;
      if (typeof localMode !== "string") return;
      if (["dark", "light"].includes(localMode)) {
        setThemeMode(localMode as "dark" | "light");
      } else {
        setThemeMode(DEFAULT_THEME_MODE);
      }
    }
  }, []);

  const themeModeValue = useMemo<ThemeModeContextType>(
    () => ({
      themeMode,
      toggleThemeMode() {
        const value = themeMode === "light" ? "dark" : "light";
        setThemeMode(value);
        localStorage.setItem(THEME_MODE_KEY, JSON.stringify(value));
      },
      setThemeMode(mode) {
        setThemeMode(mode);
        localStorage.setItem(THEME_MODE_KEY, JSON.stringify(mode));
      },
      resetThemeMode() {
        setThemeMode("light");
        localStorage.setItem(
          THEME_MODE_KEY,
          JSON.stringify(DEFAULT_THEME_MODE)
        );
      },
    }),
    [themeMode]
  );

  return (
    <ThemeModeContext.Provider value={themeModeValue}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export default ThemeModeProvider;
