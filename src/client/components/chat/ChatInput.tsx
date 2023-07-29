import { Emoji, PickerI18n } from "@emoji-mart/react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  InputBase,
  Menu,
  Paper,
  Popover,
  Stack,
  SxProps,
  Tooltip,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { SentMessage, SentMessageEvent } from "../../network/NetworkBackend";
import MaterialSymbolIcon from "../MaterialSymbolIcon";
import ChatInputActions, { ChatInputActionType } from "./ChatInputActions";
import DelayedEmojiPicker from "./DelayedEmojiPicker";
import ReplyPreview from "./ReplyPreview";
import mimeToIcon from "./mimeToIcon";

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
    const handleDeleteItem = (item: File, isImage: boolean) => {
      if (isImage) {
        setMessage((oldMessage) => ({
          ...oldMessage,
          images: oldMessage.images?.filter((image) => image !== item),
        }));
      } else {
        setMessage((oldMessage) => ({
          ...oldMessage,
          attachments: oldMessage.attachments?.filter(
            (attachment) => attachment !== item
          ),
        }));
      }
    };
    const handleActionSelect = (actionType: ChatInputActionType) => {
      switch (actionType) {
        case ChatInputActionType.FILE: {
          const element = document.createElement("input");
          element.type = "file";
          element.multiple = true;
          element.addEventListener("change", () => {
            setMessage((oldMessage) => ({
              ...oldMessage,
              attachments: [
                ...(oldMessage.attachments ?? []),
                ...(element.files ?? []),
              ],
            }));
          });
          element.click();
          break;
        }
        case ChatInputActionType.IMAGE: {
          const element = document.createElement("input");
          element.type = "file";
          element.multiple = true;
          element.accept = "image/*";
          element.addEventListener("change", () => {
            setMessage((oldMessage) => ({
              ...oldMessage,
              images: [...(oldMessage.images ?? []), ...(element.files ?? [])],
            }));
          });
          element.click();
          break;
        }
        case ChatInputActionType.ACTION: {
          break;
        }
      }
      handleOptionsMenuClose();
    };
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
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
      {}
    );
    useEffect(() => {
      const previews: Record<string, string> = {};
      message.images?.forEach((image) => {
        previews[image.name] = URL.createObjectURL(image);
      });
      setImagePreviews(previews);
      return () => {
        Object.values(previews).forEach((previewURL) =>
          URL.revokeObjectURL(previewURL)
        );
      };
    }, [message.images, message.images?.length]);
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
            }}
            elevation={elevate ? 2 : 0}
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
                border: `1px solid ${
                  isFocused
                    ? theme.palette.primary.main
                    : alpha(theme.palette.divider, 0.6)
                }`,
                boxShadow: isFocused
                  ? ["0 1px", "0 -1px", "1px 0", "-1px 0"]
                      .map(
                        (item) => `inset ${item} ${theme.palette.primary.main}`
                      )
                      .join()
                  : undefined,
                p: "7px 14px",
                flexWrap: "wrap",
                cursor: "text",
              }}
              onClick={handleFocusInput}
            >
              <Tooltip title={t("overflowTooltip")}>
                <IconButton
                  onClick={handleOptionsMenuClick}
                  id={`${optionsMenuId}-anchor`}
                >
                  <MaterialSymbolIcon
                    icon="expand_circle_down"
                    fill={isOptionsMenuOpen}
                  />
                </IconButton>
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
                  <MaterialSymbolIcon icon="mood" fill={isEmojiPickerOpen} />
                </IconButton>
              </Tooltip>
              {cannotSendMessage ? (
                <IconButton disabled aria-label={t("sendDisabled")}>
                  <MaterialSymbolIcon icon="send" />
                </IconButton>
              ) : (
                <Tooltip title={t("send")}>
                  <IconButton onClick={handleSend}>
                    <MaterialSymbolIcon icon="send" />
                  </IconButton>
                </Tooltip>
              )}
              <Stack
                direction="row"
                flexBasis="100%"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                {message.images?.map((image) => (
                  <Chip
                    label={image.name}
                    avatar={
                      <Avatar
                        src={imagePreviews[image.name]}
                        sx={{ borderRadius: "8px" }}
                      >
                        <MaterialSymbolIcon icon="image" />
                      </Avatar>
                    }
                    deleteIcon={<MaterialSymbolIcon icon="delete" />}
                    onDelete={() => handleDeleteItem(image, true)}
                    variant="tonal"
                    key={image.name}
                  />
                ))}
                {message.attachments?.map((attachment) => (
                  <Chip
                    label={attachment.name}
                    icon={
                      <MaterialSymbolIcon
                        icon={mimeToIcon(attachment.type)}
                        size={18}
                      />
                    }
                    deleteIcon={<MaterialSymbolIcon icon="delete" />}
                    onDelete={() => handleDeleteItem(attachment, false)}
                    variant="tonal"
                    key={attachment.name}
                  />
                ))}
              </Stack>
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
            i18n={
              t("emojiPicker:emojiMart", {
                returnObjects: true,
                defaultValue: "",
              }) as unknown as PickerI18n
            }
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
          <ChatInputActions onSelect={handleActionSelect} />
        </Menu>
      </>
    );
  }
);
export default ChatInput;
