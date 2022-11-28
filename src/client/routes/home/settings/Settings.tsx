import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useCallback, useContext, useId, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import TabPanel from "../../../components/TabPanel";
import { ThemeModeContext } from "../../../m3theme";
import { ThemeSchemeContext } from "../../../m3theme/context/ThemeSchemeContext";
import ColorItem from "./ColorItem";
import SwitchItem from "./SwitchItem";

export default function Settings() {
  const [tab, setTab] = useState(0);
  const [generalId, behaviorId, appearanceId] = [useId(), useId(), useId()];
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);
  const { themeScheme, generateThemeScheme } = useContext(ThemeSchemeContext);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newTab: number) => {
      setTab(newTab);
    },
    [setTab]
  );

  const handleColorChange = useDebouncedCallback((color: string) => {
    generateThemeScheme(color);
  }, 200);

  // TODO: Add accessible labels and switches via `inputProps`

  const handleThemeChange = useCallback(
    (newTheme: boolean): Promise<void> => {
      return new Promise((resolve, _reject) => {
        setThemeMode(newTheme ? "dark" : "light");
        resolve();
      });
    },
    [setThemeMode]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab
          label="General"
          id={`${generalId}-tab`}
          aria-controls={`${generalId}-panel`}
        />
        <Tab
          label="Behavior"
          id={`${behaviorId}-tab`}
          aria-controls={`${behaviorId}-panel`}
        />
        <Tab
          label="Appearance"
          id={`${appearanceId}-tab`}
          aria-controls={`${generalId}-panel`}
        />
      </Tabs>
      <TabPanel current={tab} index={0} a11yId={generalId}>
        Item One
      </TabPanel>
      <TabPanel current={tab} index={1} a11yId={behaviorId}>
        Item Two
      </TabPanel>
      <TabPanel current={tab} index={2} a11yId={appearanceId}>
        <Grid container spacing={2}>
          <SwitchItem
            initialValue={themeMode === "dark"}
            onChange={handleThemeChange}
            label="Dark Mode"
            description="Turn out the light to save your eyesight at night."
          />
          <ColorItem
            initialValue={themeScheme.light.primary}
            onChange={handleColorChange}
            label="Theme Color"
            description="Customize the interface's primary accent color to your liking."
          />
        </Grid>
      </TabPanel>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        v4.0.0-dev
      </Typography>
    </Box>
  );
}
