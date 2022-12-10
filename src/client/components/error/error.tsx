import normalizeException from "normalize-exception";
import { useLocation, useRouteError } from "react-router-dom";
import ErrorPage from "./display";

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
  // Route error
  const text =
    typeof routeError === "object" && routeError !== null
      ? Reflect.get(routeError, "statusText")
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
