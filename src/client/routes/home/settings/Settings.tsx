import { Box, Tab, Tabs } from "@mui/material";
import { useId, useState } from "react";
import TabPanel from "../../../components/TabPanel";

export default function Settings() {
  const [tab, setTab] = useState(0);
  const [generalId, behaviorId, appearanceId] = [useId(), useId(), useId()];

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

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
        Item Three
      </TabPanel>
    </Box>
  );
}
