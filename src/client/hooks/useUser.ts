import { useMemo, useSyncExternalStore } from "react";
import useBackend from "./useBackend";

export default function useUser() {
  const backend = useBackend();
  const userSubscribable = useMemo(() => backend.getUser(), [backend]);
  const user = useSyncExternalStore(
    userSubscribable.subscribe,
    userSubscribable.getSnapshot
  );
  return user;
}
