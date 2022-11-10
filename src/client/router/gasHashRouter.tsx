import { isGASEnvironment } from "gas-client/build/esm/utils/is-gas-environment";
import {
  createBrowserRouter,
  Location,
  Navigation,
  RouteObject,
} from "react-router-dom";

export interface RouterHooks {
  navigation: Navigation;
  location: Location;
}

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
): [typeof router, (routerHooks: RouterHooks) => void] {
  const router = createBrowserRouter(routes, opts);
  const isGAS = isGASEnvironment();
  let routerHooks: RouterHooks | null = null;
  const setRouterHooks = (newNavigation: RouterHooks) => {
    routerHooks = newNavigation;
    console.log(routerHooks);
  };
  let respondingToChange = false;
  console.log(`[gas-hash-router] Running in GAS Web App: ${isGAS}`);
  router.subscribe(() => {
    // To ensure that `location.hash` is updated
    setTimeout(() => {
      console.log(respondingToChange);
      console.log(router.state.location);
      if (respondingToChange) {
        respondingToChange = false;
        return; // Don't handle; responding to change on google.script.history
      }
      if (isGAS) {
        console.log("Is running is GAS; pushing changes to location to host");
        google.script.history.push(
          router.state.location.state,
          {},
          location.hash.substring(1)
        );
      }
    });
  });
  return [router, setRouterHooks];
}
