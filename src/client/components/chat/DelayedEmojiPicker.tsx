import EmojiPicker, {
  EmojiPickerData,
  EmojiPickerProps,
} from "@emoji-mart/react";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useSnackbar from "../useSnackbar";

export interface DelayedEmojiPickerProps extends EmojiPickerProps {
  dataUrl: string;
}

export default function DelayedEmojiPicker({
  dataUrl,
  ...props
}: DelayedEmojiPickerProps) {
  const [data, setData] = useState<EmojiPickerData | null>(null);
  const snackbar = useSnackbar();
  useEffect(() => {
    fetch(dataUrl)
      .then((res) => res.json())
      .then((json) => {
        setData(json as EmojiPickerData);
      })
      .catch(() => {
        snackbar.showSnackbar("Failed to load emoji picker: offline");
      });
  }, [dataUrl, snackbar]);
  return data ? (
    <EmojiPicker
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      data={data}
    />
  ) : (
    <Box
      sx={{
        borderRadius: "10px",
        width: "352px",
        height: "435px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
