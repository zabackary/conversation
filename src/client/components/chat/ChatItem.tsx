import {
  Badge,
  BadgeProps,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TimeAgo from "react-timeago";
import Message from "../../../model/message";
import useUserActivity from "../../hooks/useUserActivity";
import { ContrastBadge } from "../main/DrawerHeader";
import MaterialReactMarkdown from "./MaterialReactMarkdown";
import UserTooltip from "../UserTooltip";
import { PrivilegeLevel } from "../../../model/user";
import ProfilePicture from "../ProfilePicture";

const WHITELISTED_TRANSLATIONS = [
  "dmStart",
  "chatStart",
  "chatMemberAdd",
  "chatNameChange",
  "easteregg", // hehehe
];
const TRANSLATION_MARKER = "!translation:";

export const InlineBadge = styled(Badge)<BadgeProps>(() => ({
  position: "unset",
  "& .MuiBadge-badge": {
    position: "unset",
    transform: "unset",
  },
}));

export interface ChatItemProps {
  message: Message;
  showAvatar?: boolean;
  onContextMenu?: (x: number, y: number, message: Message) => void;
  decoration?: "primary" | "secondary" | "tertiary";
}

export default function ChatItem({
  message,
  showAvatar,
  onContextMenu,
  decoration,
}: ChatItemProps) {
  const { t } = useTranslation("message");
  const translatedMarkdown = useMemo(() => {
    if (!message.markdown.startsWith(TRANSLATION_MARKER))
      return message.markdown;
    const split = message.markdown.slice(TRANSLATION_MARKER.length).split(":");
    if (WHITELISTED_TRANSLATIONS.includes(split[0])) {
      return t(split[0], Object(split.slice(1)));
    }
    return message.markdown;
  }, [message.markdown, t]);
  const active = useUserActivity(message.user.id);
  return (
    <ListItem
      disablePadding
      disableGutters
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.call(undefined, e.clientX, e.clientY, message);
      }}
    >
      <ListItemButton
        sx={{
          p: "0 24px !important",
          pl: decoration ? "21px !important" : undefined,
          bgcolor: decoration ? `${decoration}Container.main` : undefined,
          borderLeft: decoration ? "3px solid transparent" : undefined,
          borderLeftColor: decoration ? `${decoration}.main` : undefined,
        }}
        alignItems="flex-start"
      >
        {showAvatar ? (
          <ListItemAvatar>
            <ContrastBadge
              color="success"
              variant="dot"
              sx={{ marginRight: "8px" }}
              overlap="circular"
              invisible={!active}
            >
              <Tooltip
                title={<UserTooltip user={message.user} />}
                placement="left"
              >
                <ProfilePicture user={message.user} />
              </Tooltip>
            </ContrastBadge>
          </ListItemAvatar>
        ) : null}
        <ListItemText
          primary={
            showAvatar ? (
              <>
                {message.isService ? message.user.name : message.user.nickname}
                <Stack
                  spacing={0.5}
                  mx={0.5}
                  direction="row"
                  component="span"
                  display="inline-flex"
                >
                  {message.isService ? (
                    <InlineBadge color="primary" badgeContent="bot" />
                  ) : null}
                  {message.user.privilegeLevel === PrivilegeLevel.Admin ? (
                    <InlineBadge color="secondary" badgeContent="Admin" />
                  ) : null}
                  {message.user.privilegeLevel === PrivilegeLevel.Unverified ? (
                    <InlineBadge color="warning" badgeContent="Unverified" />
                  ) : null}
                  {message.user.disabled ? (
                    <InlineBadge color="error" badgeContent="Disabled" />
                  ) : null}
                </Stack>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ opacity: 0.5 }}
                >
                  <TimeAgo date={message.sent} />
                </Typography>
              </>
            ) : null
          }
          secondary={
            <MaterialReactMarkdown sx={{ overflow: "hidden" }} inline>
              {translatedMarkdown}
            </MaterialReactMarkdown>
          }
          secondaryTypographyProps={{
            component: "div",
            sx: { wordBreak: "break-word" },
          }}
          inset={!showAvatar}
        />
      </ListItemButton>
    </ListItem>
  );
}
