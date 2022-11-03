import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Channel from "../data/channel";
import User from "../data/user";
import ErrorBoundary from "./components/error";
import Main from "./components/main";
import DefaultBackend from "./network/default_backend";

interface Props {}

export default function App(props: Props) {
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
    <ErrorBoundary>
      <Main user={user} channels={channels}>
        <Outlet />
      </Main>
    </ErrorBoundary>
  );
}
