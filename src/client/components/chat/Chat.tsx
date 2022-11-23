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
  const [_channelBackend, setChannelBackend] = useState<ChannelBackend | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  useEffect(() => {
    setChannelBackend(null);
    setMessages(null);
    if (backend) {
      (async () => {
        const newChannelBackend = await backend.connectChannel(channelId);
        setChannelBackend(newChannelBackend);
        await newChannelBackend.connect();
        const newMessages = await newChannelBackend.listMessages();
        setMessages(newMessages);
      })();
    } else {
      // eslint-disable-next-line no-console
      console.error("Unable to render Chat due to unavalible backend.");
    }
  }, [backend, channelId]);
  return <ChatList messages={messages} />;
}
