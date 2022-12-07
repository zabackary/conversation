import { useContext, useMemo, useSyncExternalStore } from "react";
import BackendContext from "../../../BackendContext";
import Dm from "../../../components/dm";

export default function DmPage() {
  const backend = useContext(BackendContext);
  if (!backend) {
    throw new Error("Backend is undefined!");
  }
  const dmsSubscribable = useMemo(() => backend.getDMs(), [backend]);
  const dms = useSyncExternalStore(
    dmsSubscribable.subscribe,
    dmsSubscribable.getSnapshot
  );
  const userSubscribable = useMemo(() => backend.getUser(), [backend]);
  const user = useSyncExternalStore(
    userSubscribable.subscribe,
    userSubscribable.getSnapshot
  );
  return <Dm channels={dms ?? undefined} user={user ?? undefined} />;
}
