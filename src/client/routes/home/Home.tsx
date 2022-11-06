import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Channel from "../../../data/channel";
import User from "../../../data/user";
import Main from "../../components/main";
import DefaultBackend from "../../network/default_backend";

export default function Home() {
  const [network, setNetwork] = useState(new DefaultBackend());
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    network.getChannels().then((channels) => {
      setChannels(channels);
    });
    network.getUser().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Main user={user} channels={channels}>
      <Outlet />
    </Main>
  );
}
