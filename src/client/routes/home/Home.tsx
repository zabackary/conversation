import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Channel from "../../../data/channel";
import User from "../../../data/user";
import Main from "../../components/main";
import DefaultBackend from "../../network/default_backend";

export default function Home() {
  const backend = useMemo(() => new DefaultBackend(), []);
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    backend.getChannels().then((networkChannels) => {
      setChannels(networkChannels);
    });
    backend.getUser().then((networkUser) => {
      setUser(networkUser);
    });
  }, [backend]);

  return (
    <Main user={user} channels={channels}>
      <Outlet />
    </Main>
  );
}
