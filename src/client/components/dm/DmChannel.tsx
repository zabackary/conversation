import {
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import Message from "../../../model/message";
import useBackend from "../../hooks/useBackend";
import useChannel from "../../hooks/useChannel";
import useUser from "../../hooks/useUser";
import { ChannelBackend } from "../../network/NetworkBackend";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import ChatView from "../chat/ChatView";
import { ConversationAppBar } from "../layout";
import useSnackbar from "../useSnackbar";

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
  const { showSnackbar } = useSnackbar();
  const [deletionOpen, setDeletionOpen] = useState(false);
  const handleDeleteChannel = () => {
    setDeletionOpen(false);
    if (channel)
      backend
        .deleteChannel(channel.id)
        .then(() => {
          // TODO: translate
          showSnackbar("Channel deleted.");
        })
        .catch(() => {
          // TODO: translate
          showSnackbar("Failed to delete channel.");
        });
  };
  // TODO: Translate component
  return (
    <>
      <ConversationAppBar
        title={otherMember?.name ?? ""}
        overflowItems={
          <MenuItem onClick={() => setDeletionOpen(true)}>
            <ListItemIcon>
              <MaterialSymbolIcon icon="delete" />
            </ListItemIcon>
            Close DM
          </MenuItem>
        }
      />
      <Dialog open={deletionOpen} onClose={() => setDeletionOpen(false)}>
        {/* TODO: Translate */}
        <DialogTitle>[untranslated] Close DM?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once you close a DM, all content within it is deleted forever. There
            is no &quot;undo&quot; button.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletionOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteChannel}>Confirm</Button>
        </DialogActions>
      </Dialog>
      {!notFound ? (
        <ChatView
          messages={messages ?? undefined}
          username={user?.nickname}
          channelName={otherMember?.name}
          onSend={(message) => {
            void channelBackend?.send(message);
          }}
          topAlert={
            messages?.length === 0 ? (
              <Card sx={{ m: 2 }} variant="outlined">
                <CardHeader
                  title="Welcome to your new DM!"
                  subheader="The other person will need to accept the invite before they can chat."
                />
              </Card>
            ) : undefined
          }
          afterInput={
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<MaterialSymbolIcon icon="contact_mail" size={18} />}
                label={`Email ${
                  otherMember?.nickname ?? otherMember?.name ?? "Loading..."
                }`}
                href={`mailto:${otherMember?.email ?? ""}`}
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
          onLoadMore={async () => {
            if (!channelBackend || !channelBackend.fetchHistory)
              throw new Error(
                "Backend not initialized or doesn't support history"
              );
            const newMessages = await channelBackend.fetchHistory();
            if (!newMessages) return true;
            setMessages((oldMessages) => [
              ...newMessages,
              ...(oldMessages ?? []),
            ]);
            return false;
          }}
          sx={{ flexGrow: 1 }}
        />
      ) : (
        <>Can&apos;t find that</>
      )}
    </>
  );
}
