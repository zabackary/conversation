import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Channel from "../../../data/channel";
import User from "../../../data/user";
import Main from "../../components/main";
import DefaultBackend from "../../network/default_backend";
import { RouterHooks } from "../../router/gasHashRouter";

interface Props {
  getSetRouterHooks: () => (nf: RouterHooks) => void;
}

export default function Home(props: Props) {
  const [network, setNetwork] = useState(new DefaultBackend());
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  props.getSetRouterHooks()({
    navigation: useNavigation(),
    location: useLocation(),
  });

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
