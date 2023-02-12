import { alpha, BottomNavigation, styled } from "@mui/material";

const NavigationRail = styled(BottomNavigation)(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "flex-start",
  height: "100%",
  background: alpha(theme.palette.primary.main, 0.05),
}));

export default NavigationRail;
