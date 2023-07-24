import { memo } from "react";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { SnackbarProvider } from "./components/useSnackbar";
import BackendContextProvider from "./context/BackendContextProvider";
import routes from "./routes";
import { M3ThemeProvider, M3TokensProvider } from "./theme";

const router =
  window.location.pathname === "/userCodeAppPanel" ||
  window.location.protocol === "file:"
    ? createHashRouter(routes)
    : createBrowserRouter(routes);

const MemoizedAppRouter = memo(() => <RouterProvider router={router} />);

export default function App() {
  return (
    <BackendContextProvider>
      <M3TokensProvider>
        <M3ThemeProvider>
          <SnackbarProvider>
            <MemoizedAppRouter />
          </SnackbarProvider>
        </M3ThemeProvider>
      </M3TokensProvider>
    </BackendContextProvider>
  );
}
