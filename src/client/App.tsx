import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { SnackbarProvider } from "./components/useSnackbar";
import BackendContextProvider from "./context/BackendContextProvider";
import routes from "./routes";
import {
  M3ThemeModeProvider,
  M3ThemeProvider,
  M3ThemeSchemeProvider,
} from "./theme";

const router =
  window.location.pathname === "/userCodeAppPanel"
    ? createHashRouter(routes)
    : createBrowserRouter(routes);

export default function App() {
  return (
    <BackendContextProvider>
      <M3ThemeModeProvider>
        <M3ThemeSchemeProvider>
          <M3ThemeProvider>
            <SnackbarProvider>
              <RouterProvider router={router} />
            </SnackbarProvider>
          </M3ThemeProvider>
        </M3ThemeSchemeProvider>
      </M3ThemeModeProvider>
    </BackendContextProvider>
  );
}
