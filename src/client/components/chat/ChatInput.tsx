import { Emoji } from "@emoji-mart/react";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import {
  alpha,
  Box,
  IconButton,
  IconButtonProps,
  InputBase,
  Menu,
  Paper,
  Popover,
  styled,
  SxProps,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  ChangeEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEvent,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { SentMessage, SentMessageEvent } from "../../network/NetworkBackend";
import ChatInputActions from "./ChatInputActions";
import DelayedEmojiPicker from "./DelayedEmojiPicker";
import ReplyPreview from "./ReplyPreview";

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

const StyledPaper = styled(Paper)`
  ${({ theme }) => `
  transition: ${theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.standard,
  })};
  &.flat {
    background-color: ${theme.palette.background.paper}
  }
  `}
`;

export interface ChatInputProps {
  onMessageSend: (message: SentMessageEvent) => void;
  sx?: SxProps;
  placeholder: string;
  elevate?: boolean;
  currentReply?: number;
  onReplyClear: () => void;
}

const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      onMessageSend,
      sx,
      placeholder,
      elevate = true,
      currentReply,
      onReplyClear,
    },
    ref
  ) => {
    const { t } = useTranslation("channel");
    const [message, setMessage] = useState<SentMessage>({
      markdown: "",
      images: [],
      attachments: [],
    });
    const cannotSendMessage =
      message.markdown === "" &&
      message.attachments?.length === 0 &&
      message.images?.length === 0;
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
    const handleSend = useCallback(() => {
      onMessageSend({
        ...message,
        // currentReply state is managed by ChatView, so need to merge state
        replied: currentReply,
      });
      setMessage({
        markdown: "",
        images: [],
        attachments: [],
      });
    }, [message, onMessageSend, currentReply]);
    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        setMessage({
          ...message,
          markdown: event.currentTarget.value,
        });
      },
      [message]
    );
    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        if (!event.getModifierState("Shift") && event.code === "Enter") {
          event.preventDefault();
          if (cannotSendMessage) return;
          handleSend();
        }
      },
      [cannotSendMessage, handleSend]
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
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFocusInput = () => {
      inputRef.current?.focus();
    };
    return (
      <>
        <Box
          sx={{
            zIndex: 1,
            pb: 2,
            px: 1,
            position: "relative",
            "&::before": {
              content: elevate ? '""' : undefined,
              bgcolor: "background.default",
              position: "absolute",
              inset: 0,
              top: 28,
              zIndex: 0,
            },
            ...sx,
          }}
          ref={ref}
        >
          <StyledPaper
            sx={{
              borderRadius: currentReply ? "22px 22px 28px 28px" : "28px",
              position: "relative",
              zIndex: 1,
              border: "1px solid transparent",
            }}
            elevation={elevate ? 1 : 0}
            className={elevate ? "" : "flat"}
          >
            {currentReply ? (
              <ReplyPreview id={currentReply} onClose={onReplyClear} />
            ) : null}
            <Box
              sx={{
                display: "flex",
                borderRadius: "28px",
                "&:hover": {
                  borderColor: isFocused ? undefined : "divider",
                },
                border: `${isFocused ? "2px" : "1px"} solid transparent`,
                borderColor: isFocused
                  ? "primary.main"
                  : alpha(theme.palette.divider, 0.6),
                p: isFocused ? "6px 13px" : "7px 14px",
                flexWrap: "wrap",
                cursor: "text",
              }}
              onClick={handleFocusInput}
            >
              <Tooltip title={t("overflowTooltip")}>
                <ExpandMore
                  expand={isOptionsMenuOpen}
                  onClick={handleOptionsMenuClick}
                  id={`${optionsMenuId}-anchor`}
                >
                  <ExpandCircleDownIcon />
                </ExpandMore>
              </Tooltip>
              <InputBase
                value={message.markdown}
                onChange={handleChange}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={message.markdown === "" ? 1 : 4}
                sx={{
                  "& textarea, & input": {
                    overflow: message.markdown === "" ? "hidden" : undefined,
                  },
                  mx: 1,
                  flexGrow: 1,
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                inputRef={inputRef}
              />
              <Tooltip title={t("emoji")}>
                <IconButton onClick={handleEmojiClick}>
                  <InsertEmoticonIcon />
                </IconButton>
              </Tooltip>
              {cannotSendMessage ? (
                <IconButton disabled aria-label={t("sendDisabled")}>
                  <SendIcon />
                </IconButton>
              ) : (
                <Tooltip title={t("send")}>
                  <IconButton onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </StyledPaper>
        </Box>
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
        >
          <DelayedEmojiPicker
            dataUrl="//cdn.jsdelivr.net/npm/@emoji-mart/data"
            onEmojiSelect={handleEmojiSelect}
            i18n={t("emojiPicker:emojiMart", {
              returnObjects: true,
              defaultValue: "",
            })}
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
);
export default ChatInput;
