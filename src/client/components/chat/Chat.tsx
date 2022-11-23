import { useContext, useEffect, useState } from "react";
import Message from "../../../data/message";
import BackendContext from "../../BackendContext";
import { ChannelBackend } from "../../network/network_definitions";
import ChatList from "./ChatList";

interface Props {
  channelId: number;
}

export default function Chat({ channelId }: Props) {
  const backend = useContext(BackendContext);
  const [channelBackend, setChannelBackend] = useState<ChannelBackend | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  useEffect(() => {
    let valid = true;
    setChannelBackend(null);
    setMessages(null);
    if (backend) {
      (async () => {
        const newChannelBackend = await backend.connectChannel(channelId);
        if (!valid) return;
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
  return <ChatList messages={messages} />;
}
