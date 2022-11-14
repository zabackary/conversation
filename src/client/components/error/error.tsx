import normalizeException from "normalize-exception";
import { useRouteError } from "react-router-dom";
import ErrorPage from "./display";

export function RouteErrorPage() {
  const routeError = useRouteError();
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
        debuggingDetails={`Uncaught ${error.name}: ${
          error.message
        }\nTraceback:\n${error.stack || JSON.stringify(error)}`}
        traceback={error.stack || JSON.stringify(error)}
      />
    );
  }
  {
    // Route error
    const text =
      typeof routeError === "object" && routeError !== null
        ? Reflect.get(routeError, "statusText")
        : error.message;
    return (
      <ErrorPage
        errorText={text}
        debuggingDetails={`Route error:\n${JSON.stringify(routeError)}`}
        traceback={JSON.stringify(routeError)}
      />
    );
  }
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
