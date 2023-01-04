import BlockIcon from "@mui/icons-material/Block";
import EmailIcon from "@mui/icons-material/Email";
import { Chip, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Message from "../../../model/message";
import useBackend from "../../hooks/useBackend";
import useChannel from "../../hooks/useChannel";
import useUser from "../../hooks/useUser";
import { ChannelBackend } from "../../network/network_definitions";
import ChatView from "../chat/ChatView";
import { ConversationAppBar } from "../layout";

export interface DmChannelProps {
  channelId: number;
}

export default function DmChannel({ channelId }: DmChannelProps) {
  const backend = useBackend();
  const [channelBackend, setChannelBackend] = useState<ChannelBackend | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [notFound, setNotFound] = useState(false);
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
  const otherMember = channel?.members.find((member) => member.id !== user?.id);
  return (
    <>
      <ConversationAppBar title={otherMember?.name ?? ""} />
      {!notFound ? (
        <ChatView
          messages={messages ?? undefined}
          username={user?.nickname}
          channelName={otherMember?.name}
          onSend={(message) => {
            channelBackend?.send(message);
          }}
          afterInput={
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<EmailIcon />}
                label={`Email ${otherMember?.nickname}`}
                component="a"
                href={`mailto:${otherMember?.email}`}
                target="_blank"
                variant="outlined"
                clickable
              />
              <Chip
                icon={<BlockIcon />}
                label="Block"
                onClick={() => {
                  // TODO: Block user
                }}
                variant="outlined"
              />
            </Stack>
          }
          sx={{ flexGrow: 1 }}
        />
      ) : (
        <>Can&apos;t find that</>
      )}
    </>
  );
}
