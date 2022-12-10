import { RouteObject } from "react-router-dom";
import ErrorRoute from "./error";
import HomeRoute from "./home";
import ChannelRoute from "./home/channel";
import DashboardRoute from "./home/DashboardRoute";
import DmRoute from "./home/dm";
import SettingsRoute from "./home/settings";
import LoginRoute from "./login";

const routes: RouteObject[] = [
  {
    path: "",
    element: <HomeRoute />,
    errorElement: <ErrorRoute />,
    children: [
      {
        path: "",
        element: <DashboardRoute />,
        children: [
          {
            path: "/dm/:channelId",
            element: <DmRoute />,
          },
        ],
      },
      {
        path: "channel/:channelId",
        element: <ChannelRoute />,
      },
      {
        path: "settings",
        element: <SettingsRoute />,
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
