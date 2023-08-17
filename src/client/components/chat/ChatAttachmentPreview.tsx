import {
  Box,
  Chip,
  CircularProgress,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";
import useAttachment from "../../hooks/useAttachment";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import mimeToIcon from "./mimeToIcon";

export interface ChatAttachmentPreviewSkeletonProps {
  isImage?: boolean;
  uploading?: boolean;
  name?: string;
}

export const ChatAttachmentPreviewSkeleton = forwardRef<
  HTMLDivElement,
  ChatAttachmentPreviewSkeletonProps
>(({ isImage, uploading, name, ...props }, ref) => {
  /* eslint-disable react/jsx-props-no-spreading */
  return isImage ? (
    <Box
      sx={{ width: 200, height: 200, position: "relative" }}
      ref={ref}
      {...props}
    >
      <Stack
        direction="column"
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.5,
          alignItems: "center",
        }}
      >
        <MaterialSymbolIcon icon="image" size={48} />
        <Typography variant="caption">Uploading</Typography>
      </Stack>
      <Skeleton
        sx={{
          inset: 0,
          position: "absolute",
          transform: "none",
          borderRadius: "8px",
        }}
      />
      <CircularProgress
        size={24}
        sx={{ position: "absolute", bottom: 8, right: 8 }}
      />
    </Box>
  ) : (
    <Chip
      variant="tonal"
      icon={
        uploading ? (
          <CircularProgress size={18} color="secondary" />
        ) : (
          <Skeleton variant="circular" sx={{ width: 18, height: 18 }} />
        )
      }
      label={name ?? <Skeleton sx={{ width: 120, height: 20 }} />}
      ref={ref}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
});

export interface ChatAttachmentPreviewProps {
  id: string;
}

export default function ChatAttachmentPreview({
  id,
}: ChatAttachmentPreviewProps) {
  const attachment = useAttachment(id);
  const downloadAttachment = () => {
    if (attachment?.url) {
      const e = document.createElement("a");
      e.target = "_blank";
      e.download = attachment.name;
      e.href = attachment.url;
      e.click();
    }
  };
  if (!attachment) {
    return <ChatAttachmentPreviewSkeleton />;
  }
  if (attachment.hasError) {
    return (
      <Tooltip title="Upload failed">
        <Chip
          variant="tonal"
          icon={<MaterialSymbolIcon icon="error" size={18} />}
          label={attachment.name}
        />
      </Tooltip>
    );
  }
  if (!attachment.url) {
    return (
      <Tooltip title="Uploading">
        <ChatAttachmentPreviewSkeleton
          isImage={attachment.isImage}
          name={attachment.name}
          uploading
        />
      </Tooltip>
    );
  }
  if (attachment.isImage) {
    return (
      <Box
        component="img"
        width={attachment.imageWidth}
        height={attachment.imageHeight}
        src={attachment.url}
        sx={{ borderRadius: "8px" }}
      />
    );
  }
  return (
    <Chip
      variant="tonal"
      icon={<MaterialSymbolIcon icon={mimeToIcon(attachment.mime)} size={18} />}
      label={attachment.name}
      onClick={downloadAttachment}
    />
  );
}
