import { Chip, List, Stack } from "@mui/material";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useThrottledCallback } from "use-debounce";
import MaterialSymbolIcon from "../../../../components/MaterialSymbolIcon";
import { ConversationAppBar } from "../../../../components/layout";
import { ColorItem, SwitchItem } from "../../../../components/settings";
import useSnackbar from "../../../../components/useSnackbar";
import { M3TokensContext } from "../../../../theme";

export default function AppearanceSettingsRoute({
  noAppBar,
}: {
  noAppBar?: boolean;
}) {
  const {
    generationOptions,
    generate: generateThemeTokens,
    reset: resetThemeTokens,
  } = useContext(M3TokensContext);

  const snackbar = useSnackbar();
  const { t } = useTranslation("settings");

  const handleColorChange = useThrottledCallback((color: string) => {
    generateThemeTokens({
      baseColorHex: color,
      themeMode: generationOptions.themeMode,
      type: "color",
    }).catch(() => {
      snackbar.showSnackbar(t("appearance.theme.error"));
    });
  }, 500);

  const handleThemeChange = useCallback(
    async (newThemeIsDark: boolean) => {
      if (generationOptions.type !== "color")
        throw new Error("Settings doesn't support image seeds yet.");
      await generateThemeTokens({
        baseColorHex: generationOptions.baseColorHex,
        type: "color",
        themeMode: newThemeIsDark ? "dark" : "light",
      }).catch(() => {
        snackbar.showSnackbar(t("appearance.theme.error"));
      });
    },
    [generateThemeTokens, generationOptions, snackbar, t]
  );
  return (
    <>
      {!noAppBar ? <ConversationAppBar title={t("appearance.title")} /> : null}
      <List>
        <SwitchItem
          value={generationOptions.themeMode === "dark"}
          onChange={handleThemeChange}
          label={t("appearance.darkmode.title")}
          description={t("appearance.darkmode.description")}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<MaterialSymbolIcon icon="restart_alt" size={18} />}
              label={t("reset")}
              onClick={() => {
                // Already handled in the other code
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                handleThemeChange(true);
              }}
              variant="outlined"
            />
          </Stack>
        </SwitchItem>
        <ColorItem
          initialValue="#ff0000"
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
              onClick={() => resetThemeTokens()}
              variant="outlined"
            />
          </Stack>
        </ColorItem>
      </List>
    </>
  );
}
