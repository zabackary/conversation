import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import ProfilePicture from "../ProfilePicture";
import useMessage from "../../hooks/useMessage";
import { parseColor } from "./DelayedEmojiPicker";
import MaterialSymbolIcon from "../MaterialSymbolIcon";

export interface ReplyPreviewProps {
  id: number;
  onClose?: () => void;
  inline?: boolean;
  sx?: SxProps;
}

export default function ReplyPreview({
  id,
  onClose,
  inline,
  sx,
}: ReplyPreviewProps) {
  const message = useMessage(id);
  const avatarHeight = inline ? 21 : 24;
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyItems="center"
      padding={inline ? undefined : 1}
      sx={sx}
    >
      {message ? (
        <Box sx={{ position: "relative" }}>
          <ProfilePicture
            user={message.user}
            sx={{ height: avatarHeight, width: avatarHeight }}
          />
          {inline ? (
            <Avatar
              sx={{
                height: avatarHeight,
                width: avatarHeight,
                position: "absolute",
                inset: 0,
                bgcolor: `rgba(${parseColor(theme.palette.onSurface.main).join(
                  ", "
                )}, 0.6)`,
              }}
            >
              <MaterialSymbolIcon size={18} icon="reply" />
            </Avatar>
          ) : null}
        </Box>
      ) : (
        <Skeleton variant="circular">
          <Avatar sx={{ height: avatarHeight, width: avatarHeight }} />
        </Skeleton>
      )}
      <Typography flexGrow={1} fontSize={inline ? 14 : undefined} noWrap>
        {message ? (
          !inline ? (
            <>
              Replying to <b>{message.user.nickname}</b>{" "}
              <Box component="i" color="text.secondary">
                {message.markdown}
              </Box>
            </>
          ) : (
            <>
              <b>{message.user.nickname}</b>{" "}
              <Box component="i" color="text.secondary">
                {message.markdown}
              </Box>
            </>
          )
        ) : (
          <Skeleton />
        )}
      </Typography>
      {!inline ? (
        <IconButton onClick={onClose} sx={{ height: 24, width: 24 }}>
          <MaterialSymbolIcon icon="cancel" size={24} />
        </IconButton>
      ) : null}
    </Stack>
  );
}
