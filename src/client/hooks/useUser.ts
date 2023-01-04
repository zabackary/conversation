import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedOutException } from "../network/network_definitions";
import useBackend from "./useBackend";

export default function useUser(navigateToLoginOnAuthFailure = true) {
  const backend = useBackend();
  const userSubscribable = useMemo(() => backend.getUser(), [backend]);
  const user = useSyncExternalStore(
    userSubscribable.subscribe,
    userSubscribable.getSnapshot
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (navigateToLoginOnAuthFailure && user instanceof LoggedOutException) {
      navigate(
        `/login/?next=${encodeURIComponent(
          window.location.pathname +
            window.location.hash +
            window.location.search
        )}`
      );
    }
  }, [user, navigateToLoginOnAuthFailure, navigate]);
  if (user instanceof Error) {
    if (!(navigateToLoginOnAuthFailure && user instanceof LoggedOutException)) {
      throw user;
    }
    return null;
  }
  return user;
}
