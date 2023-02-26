import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar, SnackbarProps } from "@mui/material";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SnackbarQueueItem {
  options: SnackbarOptions;
  message: string;
  key: number;
}

export enum SnackbarDuration {
  Long = 10000,
  Short = 4000,
}

export interface SnackbarOptions {
  /**
   * The action button of the snackbar.
   *
   * @default null
   */
  action: ReactNode;

  /**
   * Whether to show the close button.
   * @default false
   */
  showCloseButton: boolean;

  /**
   * If {@link autoHide `autoHide`} is set, then when the snackbar automatically
   * closes.
   */
  autoHideDuration: number;

  /**
   * Whether the snackbar should hide on its own.
   * @default true
   */
  autoHide: boolean;

  /**
   * Props to be forwarded to the {@link Snackbar `Snackbar`}.
   * @default {}
   */
  snackbarProps: SnackbarProps;
}

export interface SnackbarContext {
  /**
   * Show a snackbar.
   *
   * @param message The message
   * @param options The options
   * @returns A function used to cancel or hide the snackbar.
   */
  showSnackbar: (
    message: string,
    options?: Partial<SnackbarOptions>
  ) => () => void;
}

const SnackbarContext = createContext<SnackbarContext | null>(null);

export default function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("Not within context of snackbar provider.");
  return context;
}

export interface SnackbarProviderProps {
  defaultSnackbarOptions?: Partial<SnackbarOptions>;
  children: ReactNode;
}

export function SnackbarProvider({
  children,
  defaultSnackbarOptions = {},
}: SnackbarProviderProps) {
  const [queue, setQueue] = useState<readonly SnackbarQueueItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<SnackbarQueueItem>();
  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleExited = () => {
    setCurrentMessage(undefined);
  };
  const context: SnackbarContext = useMemo(
    () => ({
      showSnackbar(message, partialOptions = {}) {
        const key = Math.random();
        const options: SnackbarOptions = {
          action: null,
          autoHideDuration: SnackbarDuration.Short,
          autoHide: true,
          showCloseButton: false,
          snackbarProps: {},
          ...defaultSnackbarOptions,
          ...partialOptions,
        };
        setQueue((prev) => [...prev, { message, options, key }]);
        return () => {
          setQueue((prev) => prev.filter((item) => item.key !== key));
          if (currentMessage?.key === key) {
            handleClose();
          }
        };
      },
    }),
    [currentMessage?.key, defaultSnackbarOptions]
  );

  useEffect(() => {
    if (queue.length && !currentMessage) {
      setCurrentMessage({ ...queue[0] });
      setQueue((prev) => prev.slice(1));
      setOpen(true);
    } else if (queue.length && currentMessage && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [queue, currentMessage, open]);

  return (
    <>
      <Snackbar
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...currentMessage?.options.snackbarProps}
        key={currentMessage?.key}
        open={open}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        autoHideDuration={
          currentMessage?.options.autoHide
            ? currentMessage.options.autoHideDuration
            : undefined
        }
        message={currentMessage?.message}
        action={
          <>
            {currentMessage?.options.action}
            {currentMessage?.options.showCloseButton ? (
              <IconButton
                aria-label="close"
                color="inherit"
                sx={{ p: 0.5 }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </>
        }
      />
      <SnackbarContext.Provider value={context}>
        {children}
      </SnackbarContext.Provider>
    </>
  );
}
