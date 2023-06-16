import {
  AppBar,
  Box,
  Button,
  Container,
  Link as MuiLink,
  Toolbar,
  Typography,
} from "@mui/material";
import normalizeException from "normalize-exception";
import {
  Link,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "react-router-dom";
import ErrorPage from "./display";

// TODO: translate instead of hardcoding
const ERROR_MESSAGES: Record<number, string> = {
  404: "We couldn't find what you were looking for.",
  500: "Something went wrong on our end.",
  400: "Something went wrong on your end. Check the sent data.",
};

export default function RouteErrorPage() {
  const routeError = useRouteError();
  const location = useLocation();
  const error = normalizeException(routeError);

  if (
    typeof routeError === "object" &&
    routeError !== null &&
    error === routeError
  ) {
    // Regular error
    return (
      <ErrorPage
        errorText={error.message}
        debuggingDetails={`Timestamp: ${new Date().toISOString()}
User: unavailable
Location: ${JSON.stringify(location)}
Uncaught ${error.name}: ${error.message}
Traceback:
${error.stack || JSON.stringify(error)}`}
        traceback={error.stack || JSON.stringify(error)}
      />
    );
  }
  if (isRouteErrorResponse(routeError)) {
    // Not found, etc. error (404)
    console.log(routeError);
    return (
      <>
        <AppBar position="fixed">
          <Toolbar>
            <Typography component="h1" variant="h6">
              Conversation / {routeError.status}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { md: "flex" } }} />
            <Button color="inherit" component={Link} to="/">
              Back to main app
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container maxWidth="md" sx={{ p: 2 }}>
          <Typography component="h2" variant="h2">
            Oops.
          </Typography>
          <Typography component="h3" variant="h4" my={2}>
            {ERROR_MESSAGES[routeError.status] || routeError.statusText}{" "}
            <small>({routeError.status})</small>
          </Typography>
          {routeError.status === 404 ? (
            <Typography my={2}>
              Try checking the{" "}
              <MuiLink component={Link} to="/app">
                main app
              </MuiLink>{" "}
              or{" "}
              <MuiLink component={Link} to="/">
                the homepage
              </MuiLink>
              .
            </Typography>
          ) : null}
        </Container>
      </>
    );
  }
  // Route error
  const text =
    typeof routeError === "object" &&
    routeError !== null &&
    "statusText" in routeError
      ? String(routeError.statusText)
      : error.message;
  return (
    <ErrorPage
      errorText={text}
      debuggingDetails={`This error may be caused by user fault.
User: unavailable
Location: ${JSON.stringify(location)}
Route error:
${JSON.stringify(routeError)}`}
      traceback={JSON.stringify(routeError)}
    />
  );
}

interface ScriptErrorPageProps {
  error: Error;
}

export function ScriptErrorPage({ error }: ScriptErrorPageProps) {
  return (
    <ErrorPage
      errorText={error.message}
      debuggingDetails={`Uncaught ${error.name}: ${
        error.message
      }\nTraceback:\n${error.stack || JSON.stringify(error)}`}
      traceback={error.stack || JSON.stringify(error)}
    />
  );
}
