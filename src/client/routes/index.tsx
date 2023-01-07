import { RouteObject } from "react-router-dom";
import ErrorRoute from "./error";
import LoginRootRoute from "./login";
import LoginHelpRoute from "./login/help";
import LoginRoute from "./login/login";
import LoginRegisterRoute from "./login/register";
import LoginResetRoute from "./login/reset";
import LoginSettingsRoute from "./login/settings";
import RootRoute from "./root";
import ChannelListRoute from "./root/channels";
import ChannelRoute from "./root/channels/channel";
import NoChannelSelectedRoute from "./root/channels/NoChannelSelectedRoute";
import DashboardRoute from "./root/dashboard";
import DmListRoute from "./root/dms";
import DmRoute from "./root/dms/dm";
import NoDmSelectedRoute from "./root/dms/NoDmSelectedRoute";
import SettingsRoute from "./root/settings";
import AppearanceSettingsRoute from "./root/settings/appearance";
import BehaviorSettingsRoute from "./root/settings/behavior";
import GeneralSettingsRoute from "./root/settings/general";

const routes: RouteObject[] = [
  {
    path: "",
    element: <RootRoute />,
    errorElement: <ErrorRoute />,
    children: [
      {
        index: true,
        element: <DashboardRoute />,
      },
      {
        path: "dms",
        element: <DmListRoute />,
        children: [
          {
            index: true,
            element: <NoDmSelectedRoute />,
          },
          {
            path: ":channelId",
            element: <DmRoute />,
          },
        ],
      },
      {
        path: "channels",
        element: <ChannelListRoute />,
        children: [
          {
            index: true,
            element: <NoChannelSelectedRoute />,
          },
          {
            path: ":channelId",
            element: <ChannelRoute />,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingsRoute />,
        children: [
          {
            index: true,
            element: <GeneralSettingsRoute />,
          },
          {
            path: "behavior",
            element: <BehaviorSettingsRoute />,
          },
          {
            path: "appearance",
            element: <AppearanceSettingsRoute />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <LoginRootRoute />,
    errorElement: <ErrorRoute />,
    children: [
      { index: true, element: <LoginRoute /> },
      { path: "new", element: <LoginRegisterRoute /> },
      { path: "help", element: <LoginHelpRoute /> },
      { path: "passwordreset", element: <LoginResetRoute /> },
      { path: "settings", element: <LoginSettingsRoute /> },
    ],
  },
];
export default routes;
