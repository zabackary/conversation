import { BottomNavigationAction, styled } from "@mui/material";

const NavigationRailAction = styled(BottomNavigationAction)(() => ({
  height: "56px",
  margin: "12px 0 12px 0",
  flexGrow: "0",
  width: "88px",
  textAlign: "center",
  "& .MuiSvgIcon-root": {
    // There's custom styling oin the m3 theme to hide the ripple, but it
    // doesn't play well with the alpha since the navigation rail needs to be
    // raised (see Gmail).
    boxShadow: "none",
  },
}));

export default NavigationRailAction;
