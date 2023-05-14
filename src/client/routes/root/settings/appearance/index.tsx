import { Chip, List, Stack } from "@mui/material";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useThrottledCallback } from "use-debounce";
import MaterialSymbolIcon from "../../../../components/MaterialSymbolIcon";
import { ConversationAppBar } from "../../../../components/layout";
import { ColorItem, SwitchItem } from "../../../../components/settings";
import useSnackbar from "../../../../components/useSnackbar";
import {
  DEFAULT_THEME_MODE,
  ThemeModeContext,
  ThemeSchemeContext,
} from "../../../../theme";

export default function AppearanceSettingsRoute({
  noAppBar,
}: {
  noAppBar?: boolean;
}) {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);
  const { themeScheme, generateThemeScheme, resetThemeScheme } =
    useContext(ThemeSchemeContext);

  const snackbar = useSnackbar();
  const { t } = useTranslation("settings");

  const handleColorChange = useThrottledCallback((color: string) => {
    generateThemeScheme(color).catch(() => {
      snackbar.showSnackbar(t("appearance.theme.error"));
    });
  }, 500);

  const handleThemeChange = useCallback(
    (newTheme: boolean) => {
      setThemeMode(newTheme ? "dark" : "light");
      return Promise.resolve(undefined);
    },
    [setThemeMode]
  );
  return (
    <>
      {!noAppBar ? <ConversationAppBar title={t("appearance.title")} /> : null}
      <List>
        <SwitchItem
          value={themeMode === "dark"}
          onChange={handleThemeChange}
          label={t("appearance.darkmode.title")}
          description={t("appearance.darkmode.description")}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<MaterialSymbolIcon icon="restart_alt" size={18} />}
              label={t("reset")}
              onClick={() => setThemeMode(DEFAULT_THEME_MODE)}
              variant="outlined"
            />
          </Stack>
        </SwitchItem>
        <ColorItem
          initialValue={themeScheme.light.primary}
          onChange={handleColorChange}
          label={t("appearance.theme.title")}
          description={t("appearance.theme.description")}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<MaterialSymbolIcon icon="shuffle" size={18} />}
              label={t("random")}
              onClick={() =>
                handleColorChange(
                  `#${Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0")}`
                )
              }
              variant="outlined"
            />
            <Chip
              icon={<MaterialSymbolIcon icon="restart_alt" size={18} />}
              label={t("reset")}
              onClick={() => resetThemeScheme()}
              variant="outlined"
            />
          </Stack>
        </ColorItem>
      </List>
    </>
  );
}
