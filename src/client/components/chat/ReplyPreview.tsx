import { Avatar, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProfilePicture from "../ProfilePicture";
import useMessage from "../../hooks/useMessage";

export interface ReplyPreviewProps {
  id: number;
  onClose: () => void;
}

export default function ReplyPreview({ id, onClose }: ReplyPreviewProps) {
  console.log(id);
  const message = useMessage(id);
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyItems="center"
      height={44}
      padding={1}
    >
      {message ? (
        <ProfilePicture user={message.user} sx={{ height: 24, width: 24 }} />
      ) : (
        <Skeleton variant="circular">
          <Avatar sx={{ height: 24, width: 24 }} />
        </Skeleton>
      )}
      <Typography
        flexGrow={1}
        sx={{ wordBreak: "break-all" }}
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {message ? (
          <>
            Replying to <b>{message.user.nickname}</b> <i>{message.markdown}</i>
          </>
        ) : (
          <Skeleton />
        )}
      </Typography>
      <IconButton onClick={onClose} sx={{ height: 24, width: 24 }}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
