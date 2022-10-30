import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import * as React from "react";
import ResponsiveDrawer from "./components/DrawerLayout";

export default class App extends React.Component {
  handleOpenUserMenu() {}

  render() {
    return (
      <ResponsiveDrawer
        toolbarTitle={<>Stuff</>}
        toolbarItems={
          <IconButton
            size="large"
            onClick={this.handleOpenUserMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        }
      ></ResponsiveDrawer>
    );
  }
}
