import normalizeException from "normalize-exception";
import { useRouteError } from "react-router-dom";
import ErrorPage from "./display";

export function RouteErrorPage() {
  const routeError = useRouteError();
  const error = normalizeException(routeError);

  return (
    <ErrorPage
      /*
      // @ts-ignore */
      errorText={routeError.statusText || error.message}
      debuggingDetails={JSON.stringify(routeError)}
      traceback={JSON.stringify(routeError)}
    />
  );
}

interface ScriptErrorPageProps {
  error: Error;
}

export function ScriptErrorPage(props: ScriptErrorPageProps) {
  return (
    <ErrorPage
      errorText={props.error.message}
      debuggingDetails={`Uncaught ${props.error.name}: ${
        props.error.message
      }\nTraceback:\n${props.error.stack || JSON.stringify(props.error)}`}
      traceback={props.error.stack || JSON.stringify(props.error)}
    />
  );
}
