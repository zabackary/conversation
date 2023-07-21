import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { M3ThemeMode } from "./M3Theme";

export interface ThemeModeContextType {
  themeMode: M3ThemeMode;
  toggle: () => void;
  set: (mode: M3ThemeMode) => void;
  reset: () => void;
}

export const DEFAULT_THEME_MODE: M3ThemeMode = "dark";
const LOCAL_STORAGE_KEY = "m3-theme-mode";

export const ThemeModeContext = createContext<ThemeModeContextType>({
  themeMode: DEFAULT_THEME_MODE,
  toggle() {
    throw new Error("A provider for ThemeModeContext is not in context.");
  },
  set() {
    throw new Error("A provider for ThemeModeContext is not in context.");
  },
  reset() {
    throw new Error("A provider for ThemeModeContext is not in context.");
  },
});

interface ThemeModeProviderProps {
  children: ReactNode;
}
function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [themeMode, setThemeMode] = useState<M3ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    const keyContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (keyContent) {
      const localMode = JSON.parse(keyContent) as unknown;
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
      toggle() {
        const value = themeMode === "light" ? "dark" : "light";
        setThemeMode(value);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
      },
      set(mode) {
        setThemeMode(mode);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mode));
      },
      reset() {
        setThemeMode("light");
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
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
