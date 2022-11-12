import { isGASEnvironment } from "gas-client/build/esm/utils/is-gas-environment";
import { useMemo } from "react";

/**
 * A hook that syncs changes from the router to the Google Apps Script host.
 */
export function useGasRouterForwarder() {
  const isGAS = useMemo(() => isGASEnvironment(), [isGASEnvironment]);
  if (isGAS) return;
  // TODO: Use React Router hooks to sync changes with parent.
}
