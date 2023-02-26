import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { Chip, Grid, Stack } from "@mui/material";
import { useCallback, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
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

  const handleColorChange = useDebouncedCallback((color: string) => {
    generateThemeScheme(color).catch(() => {
      snackbar.showSnackbar("Failed to set theme color");
    });
  }, 200);

  const handleThemeChange = useCallback(
    (newTheme: boolean) => {
      setThemeMode(newTheme ? "dark" : "light");
      return Promise.resolve(undefined);
    },
    [setThemeMode]
  );
  return (
    <>
      {!noAppBar ? <ConversationAppBar title="Appearance settings" /> : null}
      <Grid container spacing={2}>
        <SwitchItem
          value={themeMode === "dark"}
          onChange={handleThemeChange}
          label="Dark Mode"
          description="Turn out the light to save your eyesight at night."
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<RestartAltIcon />}
              label="Reset"
              onClick={() => setThemeMode(DEFAULT_THEME_MODE)}
              variant="outlined"
            />
          </Stack>
        </SwitchItem>
        <ColorItem
          value={themeScheme.light.primary}
          onChange={handleColorChange}
          label="Theme Color"
          description="Customize the interface's primary accent color to your liking. The picker may jump around as the palette is generated dynamically from the selected color."
        >
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<ShuffleIcon />}
              label="Randomize"
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
              icon={<RestartAltIcon />}
              label="Reset"
              onClick={() => resetThemeScheme()}
              variant="outlined"
            />
          </Stack>
        </ColorItem>
      </Grid>
    </>
  );
}
