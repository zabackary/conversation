import { Chip, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Message from "../../../model/message";
import useBackend from "../../hooks/useBackend";
import useChannel from "../../hooks/useChannel";
import useUser from "../../hooks/useUser";
import { ChannelBackend } from "../../network/NetworkBackend";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
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
    const valid = { value: true };
    let cancel: (() => void) | null = null;
    setChannelBackend(null);
    setMessages(null);
    void (async () => {
      const newChannelBackend = await backend.connectChannel(channelId);
      if (!valid.value) return;
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --- Time could have passed since this is async
      if (!valid.value) return;
      setMessages(newMessages);
    })();
    return () => {
      valid.value = false;
      cancel?.call(undefined);
      void channelBackend?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps --- We don't care when the backend changes.
  }, [backend, channelId]);
  const otherMember = channel?.members.find((member) => member.id !== user?.id);
  // TODO: Translate component
  return (
    <>
      <ConversationAppBar title={otherMember?.name ?? ""} />
      {!notFound ? (
        <ChatView
          messages={messages ?? undefined}
          username={user?.nickname}
          channelName={otherMember?.name}
          onSend={(message) => {
            void channelBackend?.send(message);
          }}
          afterInput={
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<MaterialSymbolIcon icon="contact_mail" size={18} />}
                label={`Email ${
                  otherMember?.nickname ?? otherMember?.name ?? "Loading..."
                }`}
                href={`mailto:${otherMember?.email ?? "Loading..."}`}
                target="_blank"
                variant="outlined"
                component="a"
                clickable
              />
              <Chip
                icon={<MaterialSymbolIcon icon="contact_page" size={18} />}
                label="View profile"
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
