import FlagIcon from "@mui/icons-material/Flag";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Card, CardHeader, IconButton } from "@mui/material";
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
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatListSkeleton from "./ChatListSkeleton";

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
      <Box>
        {messages ? (
          <>
            <Card variant="outlined">
              <CardHeader
                avatar={<FlagIcon fontSize="large" />}
                title={
                  <b>This is the start of {channel?.name ?? "this channel"}.</b>
                }
                subheader="It's pretty quiet in here. Why don't you go ahead and say something?"
                action={
                  <>
                    <Button
                      variant="filled"
                      sx={{ display: { xs: "none", md: "block" } }}
                    >
                      Add members
                    </Button>
                    <IconButton sx={{ display: { md: "none" } }}>
                      <PersonAddIcon />
                    </IconButton>
                  </>
                }
              />
            </Card>
            <ChatList messages={messages} />
          </>
        ) : (
          <ChatListSkeleton />
        )}
        <ChatInput
          onMessageSend={() => {
            /* TODO: implement this */
          }}
          sx={{
            position: "sticky",
            bottom: "24px",
          }}
          placeholder={
            channel && user
              ? `Message ${channel.name} as ${user.nickname}...`
              : ""
          }
        />
      </Box>
    </>
  );
}
