import { useMemo, useSyncExternalStore } from "react";
import useBackend from "./useBackend";

export default function useChannels() {
  const backend = useBackend();
  const channelsSubscribable = useMemo(() => backend.getChannels(), [backend]);
  const channels = useSyncExternalStore(
    channelsSubscribable.subscribe,
    channelsSubscribable.getSnapshot
  );
  return channels;
}
