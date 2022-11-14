import { isGASEnvironment } from "gas-client/build/esm/utils/is-gas-environment";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A hook that syncs changes from the router to the Google Apps Script host.
 */
const useGasRouterForwarder = isGASEnvironment()
  ? () => {
      // TODO: Use React Router hooks to sync changes with parent.
      const location = useLocation();
      useEffect(() => {
        google.script.history.push(
          location.state,
          undefined,
          `${location.pathname}${location.search}${location.hash}`
        );
      }, [location]);
      // Make sure parent is synchronized on load
      useEffect(() => {
        google.script.history.replace(
          location.state,
          undefined,
          `${location.pathname}${location.search}${location.hash}`
        );
        // NOTE: Run effect only once on mount (ignoring eslint)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    }
  : () => {
      // Noop for non-GAS enviornment
    };
export default useGasRouterForwarder;
