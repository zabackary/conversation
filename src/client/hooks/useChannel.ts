import { useMemo, useSyncExternalStore } from "react";
import useBackend from "./useBackend";

export default function useChannel(id: number) {
  const backend = useBackend();
  const channelSubscribable = useMemo(
    () => backend.getChannel(id),
    [backend, id]
  );
  const channel = useSyncExternalStore(
    channelSubscribable.subscribe,
    channelSubscribable.getSnapshot
  );
  return channel;
}
