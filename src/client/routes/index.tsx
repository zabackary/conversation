import { RouteObject } from "react-router-dom";
import ErrorRoute from "./error";
import LoginRoute from "./login";
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
        path: "",
        element: <DashboardRoute />,
      },
      {
        path: "dms",
        element: <DmListRoute />,
        children: [
          {
            path: "",
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
            path: "",
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
            path: "",
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
    element: <LoginRoute />,
    errorElement: <ErrorRoute />,
    children: [{ path: "create", element: null }],
  },
];
export default routes;
