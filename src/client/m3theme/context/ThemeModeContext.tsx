import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { M3ThemeMode } from "../m3/M3Theme";

export interface ThemeModeContextType {
  themeMode: M3ThemeMode;
  toggleThemeMode: () => void;
  resetThemeMode: () => void;
}

const DEFAULT_MODE: M3ThemeMode = "dark";
const THEME_MODE_KEY = "ThemeMode";

export const ThemeModeContext = createContext<ThemeModeContextType>({
  themeMode: DEFAULT_MODE,
  toggleThemeMode: () => {
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
  const [themeMode, setThemeMode] = useState<M3ThemeMode>(DEFAULT_MODE);

  useEffect(() => {
    if (localStorage.getItem(THEME_MODE_KEY)) {
      const localMode = JSON.parse(
        localStorage.getItem(THEME_MODE_KEY) || "{}"
      );
      setThemeMode(localMode);
    }
  }, []);

  const themeModeValue = useMemo(
    () => ({
      themeMode,
      toggleThemeMode() {
        const value = themeMode === "light" ? "dark" : "light";
        setThemeMode(value);
        localStorage.setItem(THEME_MODE_KEY, JSON.stringify(value));
      },
      resetThemeMode() {
        setThemeMode("light");
        localStorage.setItem(THEME_MODE_KEY, JSON.stringify(DEFAULT_MODE));
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
