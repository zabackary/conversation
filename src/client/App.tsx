import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BackendContext from "./context/BackendContext";
import DefaultBackend from "./network/default_backend";
import routes from "./routes";
import {
  M3ThemeModeProvider,
  M3ThemeProvider,
  M3ThemeSchemeProvider,
} from "./theme";

const router = createBrowserRouter(routes);

export default function App() {
  const [backend] = useState(new DefaultBackend());
  return (
    <BackendContext.Provider value={backend}>
      <M3ThemeModeProvider>
        <M3ThemeSchemeProvider>
          <M3ThemeProvider>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </M3ThemeProvider>
        </M3ThemeSchemeProvider>
      </M3ThemeModeProvider>
    </BackendContext.Provider>
  );
}
