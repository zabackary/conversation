import type { RouteObject } from "react-router-dom";
import { createHashRouter } from "react-router-dom";

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
    window?: Window;
  }
) {
  const router = createHashRouter(routes, opts);
  router.subscribe(() => {
    console.log(router.state.location.hash);
  });
  return router;
}
