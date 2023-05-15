import {
  alpha,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Message from "../../../model/message";
import useBackend from "../../hooks/useBackend";
import useChannel from "../../hooks/useChannel";
import useUser from "../../hooks/useUser";
import { ChannelBackend } from "../../network/NetworkBackend";
import { ConversationAppBar, navigationRailWidth } from "../layout";
import { drawerWidth } from "../layout/ConversationNavigationDrawer";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import ChatView from "./ChatView";
import InfoMenu from "./InfoMenu";
import PeopleMenu from "./PeopleMenu";

const sideSheetWidth = 300;

export const SideSheetToolbar = styled(Toolbar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SideSheet = styled(Drawer)(({ theme }) => ({
  "&.MuiDrawer-docked .MuiDrawer-paper": {
    minHeight: 360,
    width: sideSheetWidth,
    borderRadius: 16,
    margin: 16,
    marginLeft: 0,
    background: alpha(theme.palette.primary.main, 0.1),
    height: "calc(100% - 32px)",
  },
}));

const MainContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: sideSheetWidth + 24,
  }),
}));

export interface ChatProps {
  channelId: number;
}

export default function Chat({ channelId }: ChatProps) {
  const backend = useBackend();
  const { t } = useTranslation("channel");
  const [channelBackend, setChannelBackend] = useState<ChannelBackend | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<"people" | "info" | null>(
    null
  );
  const channel = useChannel(channelId);
  const user = useUser();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
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
  return (
    <>
      <ConversationAppBar
        title={channel?.name ?? ""}
        sx={
          !isMobile && activeSidebar
            ? {
                width: {
                  sm: `calc(100% - ${
                    drawerWidth + navigationRailWidth + sideSheetWidth + 24
                  }px)`,
                },
                mr: `${sideSheetWidth + 24}px`,
              }
            : {}
        }
        items={
          <>
            <IconButton
              onClick={() =>
                setActiveSidebar((current) =>
                  current === "info" ? null : "info"
                )
              }
              color={activeSidebar === "info" ? "secondary" : undefined}
              size="large"
            >
              {activeSidebar === "info" ? (
                <MaterialSymbolIcon icon="info" fill />
              ) : (
                <MaterialSymbolIcon icon="info" />
              )}
            </IconButton>
            <IconButton
              onClick={() =>
                setActiveSidebar((current) =>
                  current === "people" ? null : "people"
                )
              }
              color={activeSidebar === "people" ? "secondary" : undefined}
              size="large"
            >
              {activeSidebar === "people" ? (
                <MaterialSymbolIcon icon="group" fill />
              ) : (
                <MaterialSymbolIcon icon="group" />
              )}
            </IconButton>
          </>
        }
      />
      <MainContainer open={!isMobile && !!activeSidebar}>
        {!notFound ? (
          <ChatView
            messages={messages ?? undefined}
            username={user?.nickname}
            channelName={channel?.name}
            onSend={(message) => {
              void channelBackend?.send(message);
            }}
          />
        ) : (
          t("notFound")
        )}
      </MainContainer>
      <SideSheet
        variant={isMobile ? "temporary" : "persistent"}
        anchor={isMobile ? "bottom" : "right"}
        open={activeSidebar === "info"}
        onClose={() => setActiveSidebar(null)}
      >
        {channel ? (
          <InfoMenu
            channel={channel}
            sx={{ p: 2 }}
            handleSidebarClose={() => setActiveSidebar(null)}
          />
        ) : (
          <>
            <SideSheetToolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {t("channelInfo.title")}
              </Typography>
              <IconButton onClick={() => setActiveSidebar(null)} edge="end">
                <MaterialSymbolIcon icon="close" />
              </IconButton>
            </SideSheetToolbar>
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          </>
        )}
      </SideSheet>
      <SideSheet
        variant={isMobile ? "temporary" : "persistent"}
        anchor={isMobile ? "bottom" : "right"}
        open={activeSidebar === "people"}
        onClose={() => setActiveSidebar(null)}
      >
        {channel ? (
          <PeopleMenu
            channel={channel}
            sx={{ p: 2 }}
            handleSidebarClose={() => setActiveSidebar(null)}
          />
        ) : (
          <>
            <SideSheetToolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {t("people.title")}
              </Typography>
              <IconButton onClick={() => setActiveSidebar(null)} edge="end">
                <MaterialSymbolIcon icon="close" />
              </IconButton>
            </SideSheetToolbar>
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          </>
        )}
      </SideSheet>
    </>
  );
}
