import { useMemo, useSyncExternalStore } from "react";
import useBackend from "./useBackend";

export default function useDMs() {
  const backend = useBackend();
  const dmsSubscribable = useMemo(() => backend.getDMs(), [backend]);
  const dms = useSyncExternalStore(
    dmsSubscribable.subscribe,
    dmsSubscribable.getSnapshot
  );
  return dms;
}
