import {
  AppBar,
  Container,
  Divider,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { Link } from "react-router-dom";
import Document from "../../components/Document";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";
import { DocumentType } from "../../network/NetworkBackend";

export default function LegalRoute() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 0 : 4}
        sx={{
          bgcolor: trigger ? undefined : "inherit",
        }}
      >
        <Toolbar>
          <IconButton edge="start" component={Link} to="/" sx={{ mr: 1 }}>
            <MaterialSymbolIcon icon="arrow_back" />
          </IconButton>
          <Typography component="h1" variant="h5">
            Legal
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Document documentType={DocumentType.TERMS_OF_SERVICE} />
        <Divider sx={{ my: 2 }} />
        <Document documentType={DocumentType.PRIVACY_POLICY} />
      </Container>
    </>
  );
}
