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
  Typography,
} from "@mui/material";
import * as React from "react";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
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

export default function ErrorPage(props: ErrorPageProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh", backgroundColor: "" }}
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
            <i>{props.errorText}</i>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button size="small">Reload</Button>
          <Button size="small">Copy debugging details</Button>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show stack trace"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto">
          <CardContent>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
            >
              {props.traceback}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
}
