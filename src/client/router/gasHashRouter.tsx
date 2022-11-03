import {
  createHashHistory,
  createRouter,
  HydrationState,
  Router as RemixRouter,
} from "@remix-run/router";
import type { RouteObject } from "react-router";
import { UNSAFE_enhanceManualRouteObjects as enhanceManualRouteObjects } from "react-router";

/**
 * A router that mimics react-router's hash router except syncing changes with
 * the Google Apps Script `google.script.url`.
 *
 * From https://github.com/remix-run/react-router/blob/7796d893566f11bd9cd9f7f47f0bd9ae09139485/packages/react-router-dom/index.tsx#L213
 */
export function createGasHashRouter(
  routes: RouteObject[],
  opts?: {
    basename?: string;
    hydrationData?: HydrationState;
    window?: Window;
  }
): RemixRouter {
  const router = createRouter({
    basename: opts?.basename,
    history: createHashHistory({ window: opts?.window }),
    // @ts-ignore
    hydrationData: opts?.hydrationData || window?.__staticRouterHydrationData,
    routes: enhanceManualRouteObjects(routes),
  }).initialize();
  router.subscribe(() => {
    console.log(router.state.location.hash);
  });
  return router;
}
