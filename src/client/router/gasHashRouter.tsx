import { isGASEnvironment } from "gas-client/build/esm/utils/is-gas-environment";
import type { RouteObject } from "react-router-dom";
import { createHashRouter } from "react-router-dom";

/**
 * A router that mimics react-router's hash router except syncing changes with
 * the Google Apps Script `google.script.url`.
 *
 * Method signature should be the same as `createHashRouter`.
 */
export function createGasHashRouter(
  routes: RouteObject[],
  opts?: {
    basename?: string;
    window?: Window;
  }
) {
  const router = createHashRouter(routes, opts);
  const isGAS = isGASEnvironment();
  console.log(`[gas-hash-router] Running in Google Scripts Web App: ${isGAS}`);
  router.subscribe(() => {
    console.log(router.state.location);
    if (isGAS) {
      console.log(
        "Is running is google apps script; pushing changes to location to host"
      );
      google.script.history.push(
        router.state.location.state,
        {},
        location.hash
      );
    }
  });
  return router;
}
