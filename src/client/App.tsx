import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BackendContext from "./BackendContext";
import { RouteErrorPage } from "./components/error/error";
import ThemeModeProvider from "./m3theme/context/ThemeModeContext";
import ThemeSchemeProvider from "./m3theme/context/ThemeSchemeContext";
import M3ThemeProvider from "./m3theme/m3/M3ThemeProvider";
import DefaultBackend from "./network/default_backend";
import Channel from "./routes/home/channel/Channel";
import Home from "./routes/home/Home";
import Settings from "./routes/home/settings/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: "channel/:channelId",
        element: <Channel />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default function App() {
  const [backend, _setBackend] = useState(new DefaultBackend());
  return (
    <BackendContext.Provider value={backend}>
      <ThemeModeProvider>
        <ThemeSchemeProvider>
          <M3ThemeProvider>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </M3ThemeProvider>
        </ThemeSchemeProvider>
      </ThemeModeProvider>
    </BackendContext.Provider>
  );
}
