import { CssBaseline } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BackendContextProvider from "./context/BackendContextProvider";
import routes from "./routes";
import {
  M3ThemeModeProvider,
  M3ThemeProvider,
  M3ThemeSchemeProvider,
} from "./theme";

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <BackendContextProvider>
      <M3ThemeModeProvider>
        <M3ThemeSchemeProvider>
          <M3ThemeProvider>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </M3ThemeProvider>
        </M3ThemeSchemeProvider>
      </M3ThemeModeProvider>
    </BackendContextProvider>
  );
}
