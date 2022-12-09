import {
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Message from "../../../data/message";
import BackendContext from "../../BackendContext";
import { ChannelBackend } from "../../network/network_definitions";
import { ConversationAppBar } from "../DrawerLayout";
import ChatView from "./ChatView";

interface Props {
  channelId: number;
}

export default function Chat({ channelId }: Props) {
  const backend = useContext(BackendContext);
  if (!backend) {
    throw new Error("Backend is undefined!");
  }
  const [channelBackend, setChannelBackend] = useState<ChannelBackend | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const channelSubscribable = useMemo(
    () => backend?.getChannel(channelId),
    [backend, channelId]
  );
  const channel = useSyncExternalStore(
    channelSubscribable.subscribe,
    channelSubscribable.getSnapshot
  );
  const userSubscribable = useMemo(() => backend?.getUser(), [backend]);
  const user = useSyncExternalStore(
    userSubscribable.subscribe,
    userSubscribable.getSnapshot
  );
  useEffect(() => {
    let valid = true;
    setChannelBackend(null);
    setMessages(null);
    if (backend) {
      (async () => {
        const newChannelBackend = await backend.connectChannel(channelId);
        if (!valid) return;
        if (!newChannelBackend) {
          setNotFound(true);
          return;
        }
        setChannelBackend(newChannelBackend);
        await newChannelBackend.connect();
        const newMessages = await newChannelBackend.listMessages();
        if (!valid) return;
        setMessages(newMessages);
      })();
      return () => {
        valid = false;
        channelBackend?.disconnect();
      };
    }
    // eslint-disable-next-line no-console
    console.error("Unable to render Chat due to unavalible backend.");
    return () => {
      // Noop
    };
    // Don't care whether channelBackend changes, we just need to disconnect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, channelId]);
  return (
    <>
      <ConversationAppBar title={channel?.name ?? ""} />
      {notFound ? (
        <ChatView
          messages={messages ?? undefined}
          username={user?.nickname}
          channelName={channel?.name}
          onSend={() => {
            // TODO: Implement
          }}
        />
      ) : (
        "Can't find that"
      )}
    </>
  );
}
