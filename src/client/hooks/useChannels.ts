import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedOutException } from "../network/network_definitions";
import useBackend from "./useBackend";

export default function useChannels(navigateToLoginOnAuthFailure = true) {
  const backend = useBackend();
  const channelsSubscribable = useMemo(() => backend.getChannels(), [backend]);
  const channels = useSyncExternalStore(
    channelsSubscribable.subscribe,
    channelsSubscribable.getSnapshot
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (
      navigateToLoginOnAuthFailure &&
      channels instanceof LoggedOutException
    ) {
      navigate(
        `/login/?next=${encodeURIComponent(
          window.location.pathname +
            window.location.hash +
            window.location.search
        )}`
      );
    }
  }, [channels, navigateToLoginOnAuthFailure, navigate]);
  if (channels instanceof Error) {
    if (
      !(navigateToLoginOnAuthFailure && channels instanceof LoggedOutException)
    ) {
      throw channels;
    }
    return null;
  }
  return channels;
}
