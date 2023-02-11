import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Message from "../../../model/message";
import useBackend from "../../hooks/useBackend";
import useChannel from "../../hooks/useChannel";
import useUser from "../../hooks/useUser";
import { ChannelBackend } from "../../network/network_definitions";
import { ConversationAppBar } from "../layout";
import ChatView from "./ChatView";

interface Props {
  channelId: number;
}

export default function Chat({ channelId }: Props) {
  const backend = useBackend();
  const [channelBackend, setChannelBackend] = useState<ChannelBackend | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const channel = useChannel(channelId);
  const user = useUser();
  useEffect(() => {
    let valid = true;
    let cancel: (() => void) | null = null;
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
        cancel = newChannelBackend.subscribe((event) => {
          if (event.type === "message") {
            setMessages(
              (oldMessages) => oldMessages?.concat([event.newMessage]) ?? null
            );
          }
        });
        const newMessages = await newChannelBackend.listMessages();
        if (!valid) return;
        setMessages(newMessages);
      })();
      return () => {
        valid = false;
        cancel?.call(undefined);
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
      <ConversationAppBar
        title={channel?.name ?? ""}
        items={
          <>
            <IconButton
              onClick={() => setInfoOpen((value) => !value)}
              color={infoOpen ? "secondary" : undefined}
              size="large"
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              onClick={() => setPeopleOpen((value) => !value)}
              color={peopleOpen ? "secondary" : undefined}
              size="large"
            >
              <PeopleIcon />
            </IconButton>
          </>
        }
      />
      {!notFound ? (
        <ChatView
          messages={messages ?? undefined}
          username={user?.nickname}
          channelName={channel?.name}
          onSend={(message) => {
            channelBackend?.send(message);
          }}
        />
      ) : (
        "Can't find that"
      )}
    </>
  );
}
