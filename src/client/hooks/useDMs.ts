import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedOutException } from "../network/network_definitions";
import useBackend from "./useBackend";

export default function useDMs(navigateToLoginOnAuthFailure = true) {
  const backend = useBackend();
  const dmsSubscribable = useMemo(() => backend.getDMs(), [backend]);
  const dms = useSyncExternalStore(
    dmsSubscribable.subscribe,
    dmsSubscribable.getSnapshot
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (navigateToLoginOnAuthFailure && dms instanceof LoggedOutException) {
      navigate(
        `/login/?next=${encodeURIComponent(
          window.location.pathname +
            window.location.hash +
            window.location.search
        )}`
      );
    }
  }, [dms, navigateToLoginOnAuthFailure, navigate]);
  if (dms instanceof Error) {
    if (!(navigateToLoginOnAuthFailure && dms instanceof LoggedOutException)) {
      throw dms;
    }
    return null;
  }
  return dms;
}
