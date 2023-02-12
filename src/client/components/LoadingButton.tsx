import { Box, Button, ButtonProps, CircularProgress } from "@mui/material";
import { forwardRef } from "react";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, children, sx, ...props }, ref) => {
    return (
      <Button
        sx={{ position: "relative", ...sx }}
        disabled={loading}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {loading ? (
          <CircularProgress
            color="inherit"
            size={16}
            sx={{
              position: "absolute",
              top: "calc(50% - 8px)",
              left: "calc(50% - 8px)",
            }}
          />
        ) : null}
        <Box
          component="span"
          sx={{ visibility: loading ? "hidden" : "visible" }}
          aria-hidden={loading}
        >
          {children}
        </Box>
      </Button>
    );
  }
);

export default LoadingButton;
