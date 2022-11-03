import { useEffect, useState } from "react";
import Channel from "../data/channel";
import User from "../data/user";
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

  return <Main user={user} channels={channels}></Main>;
}
