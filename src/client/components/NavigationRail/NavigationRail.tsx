import { BottomNavigation, styled } from "@mui/material";

const NavigationRail = styled(BottomNavigation)(() => ({
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "flex-start",
  height: "100%",
}));

export default NavigationRail;
