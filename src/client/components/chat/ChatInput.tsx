import EmojiPicker, { Emoji } from "@emoji-mart/react";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import {
  IconButton,
  IconButtonProps,
  InputAdornment,
  Menu,
  OutlinedInput,
  Paper,
  Popover,
  styled,
  SxProps,
  Tooltip,
} from "@mui/material";
import {
  ChangeEventHandler,
  forwardRef,
  MouseEventHandler,
  PointerEvent,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import { ThemeModeContext } from "../../m3theme";
import ChatInputActions from "./ChatInputActions";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled(
  forwardRef<HTMLButtonElement, ExpandMoreProps>((props, ref) => {
    const { expand: _, ...other } = props;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <IconButton {...other} ref={ref} />;
  })
)(({ theme, expand }) => ({
  transform: !expand ? "rotate(180deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Message {
  markdown: string;
  images?: never[];
  attachments: never[];
}

export type MessageEvent = Message | { action: never };

interface Props {
  onMessageSend: (message: MessageEvent) => void;
  sx?: SxProps;
  placeholder: string;
}

export default function ChatInput({ onMessageSend, sx, placeholder }: Props) {
  const { themeMode } = useContext(ThemeModeContext);
  const [message, setMessage] = useState<Message>({
    markdown: "",
    images: [],
    attachments: [],
  });
  const [optionsMenuAnchor, setOptionsMenuAnchor] =
    useState<HTMLButtonElement | null>(null);
  const handleOptionsMenuClick: MouseEventHandler<HTMLButtonElement> =
    useCallback((event) => {
      setOptionsMenuAnchor(event.currentTarget);
    }, []);
  const handleOptionsMenuClose = useCallback(() => {
    setOptionsMenuAnchor(null);
  }, [setOptionsMenuAnchor]);
  const [emojiPickerAnchor, setEmojiPickerAnchor] =
    useState<HTMLButtonElement | null>(null);
  const handleEmojiClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setEmojiPickerAnchor(event.currentTarget);
    },
    []
  );
  const handleSendClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (_event) => {
      onMessageSend(message);
    },
    [message, onMessageSend]
  );
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setMessage({
        ...message,
        markdown: event.currentTarget.value,
      });
    },
    [message]
  );
  const handleEmojiSelect = useCallback(
    (emoji: Emoji, _event: PointerEvent) => {
      setEmojiPickerAnchor(null);
      setMessage((oldMessage) => ({
        ...oldMessage,
        markdown: oldMessage.markdown + emoji.native,
      }));
    },
    []
  );
  const handleEmojiPickerClose = useCallback(() => {
    setEmojiPickerAnchor(null);
  }, [setEmojiPickerAnchor]);
  const emojiPickerPopoverId = useId();
  const optionsMenuId = useId();
  const isEmojiPickerOpen = !!emojiPickerAnchor;
  const isOptionsMenuOpen = !!optionsMenuAnchor;
  return (
    <>
      <Paper sx={{ borderRadius: 28, ...sx }}>
        <OutlinedInput
          fullWidth
          sx={{ borderRadius: 28 }}
          value={message.markdown}
          onChange={handleChange}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Tooltip title="More options">
                <ExpandMore
                  expand={false}
                  onClick={handleOptionsMenuClick}
                  id={`${optionsMenuId}-anchor`}
                >
                  <ExpandCircleDownIcon />
                </ExpandMore>
              </Tooltip>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <Tooltip title="Insert emoji">
                <IconButton onClick={handleEmojiClick}>
                  <InsertEmoticonIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Send">
                <IconButton onClick={handleSendClick}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          }
        />
      </Paper>
      <Popover
        id={emojiPickerPopoverId}
        open={isEmojiPickerOpen}
        anchorEl={emojiPickerAnchor}
        onClose={handleEmojiPickerClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{ sx: { borderRadius: "10px", width: "352px" } }}
      >
        <EmojiPicker
          data={() =>
            fetch("//cdn.jsdelivr.net/npm/@emoji-mart/data").then((res) =>
              res.json()
            )
          }
          onEmojiSelect={handleEmojiSelect}
          theme={themeMode}
        />
      </Popover>
      <Menu
        id={optionsMenuId}
        anchorEl={optionsMenuAnchor}
        open={isOptionsMenuOpen}
        onClose={handleOptionsMenuClose}
        MenuListProps={{
          "aria-labelledby": `${optionsMenuId}-anchor`,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChatInputActions />
      </Menu>
    </>
  );
}
