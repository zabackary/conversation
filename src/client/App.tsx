import normalizeException from "normalize-exception";
import { memo } from "react";
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
  window.location.pathname === "/userCodeAppPanel" ||
  window.location.protocol === "file:"
    ? createHashRouter(routes)
    : createBrowserRouter(routes);

const MemoizedAppRouter = memo(() => <RouterProvider router={router} />);

window.addEventListener("error", (event) => {
  document.write(
    `<pre>Fatal error: ${
      normalizeException(event.error).stack ?? "failed to get error content"
    }</pre>`
  );
});

export default function App() {
  return (
    <BackendContextProvider>
      <M3ThemeModeProvider>
        <M3ThemeSchemeProvider>
          <M3ThemeProvider>
            <SnackbarProvider>
              <MemoizedAppRouter />
            </SnackbarProvider>
          </M3ThemeProvider>
        </M3ThemeSchemeProvider>
      </M3ThemeModeProvider>
    </BackendContextProvider>
  );
}
