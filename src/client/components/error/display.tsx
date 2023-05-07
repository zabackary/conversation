import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import MaterialSymbolIcon from "../MaterialSymbolIcon";

interface ErrorPageProps {
  errorText: string;
  debuggingDetails: string;
  traceback: string;
}

export default function ErrorPage({
  errorText,
  traceback,
  debuggingDetails,
}: ErrorPageProps) {
  const [expanded, setExpanded] = useState(false);
  const [debuggingDetailsTooltip, setDebuggingDetailsTooltip] =
    useState("Copy to clipboard");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCopyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(debuggingDetails);
      setDebuggingDetailsTooltip("Copied to clipboard.");
    } catch (e) {
      setDebuggingDetailsTooltip("Failed to write to clipboard.");
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh", backgroundColor: "black" }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Oops!
          </Typography>
          <Typography variant="body2" component="div">
            An unexpected error has occurred. Please inform the developer and
            make sure to include the debugging information. Press the `copy`
            button to copy the needed information to your clipboard.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <i>{errorText}</i>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button size="small" component={Link} to="/">
            Go home
          </Button>
          <Tooltip title={debuggingDetailsTooltip}>
            <Button
              size="small"
              onClick={() => {
                void handleCopyButtonClick();
              }}
            >
              Copy debugging details
            </Button>
          </Tooltip>
          <Tooltip title="Show stack trace">
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show stack trace"
              sx={{ ml: "auto" }}
            >
              <MaterialSymbolIcon icon="expand_circle_down" fill={expanded} />
            </IconButton>
          </Tooltip>
        </CardActions>
        <Collapse in={expanded} timeout="auto">
          <CardContent>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
            >
              {traceback}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
}
