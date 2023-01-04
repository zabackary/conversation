import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedOutException } from "../network/network_definitions";
import useBackend from "./useBackend";

export default function useChannel(
  id: number,
  navigateToLoginOnAuthFailure = true
) {
  const backend = useBackend();
  const channelSubscribable = useMemo(
    () => backend.getChannel(id),
    [backend, id]
  );
  const channel = useSyncExternalStore(
    channelSubscribable.subscribe,
    channelSubscribable.getSnapshot
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (navigateToLoginOnAuthFailure && channel instanceof LoggedOutException) {
      navigate(
        `/login/?next=${encodeURIComponent(
          window.location.pathname +
            window.location.hash +
            window.location.search
        )}`
      );
    }
  }, [channel, navigateToLoginOnAuthFailure, navigate]);
  if (channel instanceof Error) {
    if (
      !(navigateToLoginOnAuthFailure && channel instanceof LoggedOutException)
    ) {
      throw channel;
    }
    return null;
  }
  return channel;
}
