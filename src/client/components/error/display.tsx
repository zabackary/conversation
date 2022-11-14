import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { forwardRef, useState } from "react";

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
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
            An unexpected error has occurred. Please inform the developer with
            the details below.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <i>{errorText}</i>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button size="small">Reload</Button>
          <Tooltip title={debuggingDetailsTooltip}>
            <Button size="small" onClick={handleCopyButtonClick}>
              Copy debugging details
            </Button>
          </Tooltip>
          <Tooltip title="Show stack trace">
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show stack trace"
            >
              <ExpandMoreIcon />
            </ExpandMore>
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
