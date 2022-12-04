import { useMemo, useSyncExternalStore } from "react";

import { Outlet } from "react-router-dom";
import Main from "../../components/main";
import DefaultBackend from "../../network/default_backend";

export default function Home() {
  const backend = useMemo(() => new DefaultBackend(), []);

  const channelsSubscribable = useMemo(() => backend.getChannels(), [backend]);
  const channels = useSyncExternalStore(
    channelsSubscribable.subscribe,
    channelsSubscribable.getSnapshot
  );
  const userSubscribable = useMemo(() => backend.getUser(), [backend]);
  const user = useSyncExternalStore(
    userSubscribable.subscribe,
    userSubscribable.getSnapshot
  );

  return (
    <Main user={user} channels={channels}>
      <Outlet />
    </Main>
  );
}
