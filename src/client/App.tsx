import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { RouteErrorPage } from "./components/error/error";
import ThemeModeProvider from "./m3theme/context/ThemeModeContext";
import ThemeSchemeProvider from "./m3theme/context/ThemeSchemeContext";
import M3ThemeProvider from "./m3theme/m3/M3ThemeProvider";
import DefaultBackend from "./network/default_backend";
import { createGasHashRouter } from "./router/gasHashRouter";
import Channel from "./routes/home/channel/Channel";
import Home from "./routes/home/Home";

const router = createGasHashRouter([
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
      },
    ],
  },
]);

export default function App() {
  const [backend, setBackend] = useState(new DefaultBackend());

  return (
    <ThemeModeProvider>
      <ThemeSchemeProvider>
        <M3ThemeProvider>
          <CssBaseline enableColorScheme />
          <RouterProvider router={router} />
        </M3ThemeProvider>
      </ThemeSchemeProvider>
    </ThemeModeProvider>
  );
}
