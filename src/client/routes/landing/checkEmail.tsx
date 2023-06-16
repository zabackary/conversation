import { Box, Container, Paper, Typography } from "@mui/material";
import MaterialSymbolIcon from "../../components/MaterialSymbolIcon";

export default function CheckEmailRoute() {
  // TODO: translate
  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 12, pb: 8 }}>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography component="h1" variant="h5" mb="8px">
          Check your inbox!
        </Typography>
        <MaterialSymbolIcon
          sx={{ my: 3 }}
          size={78}
          icon="forward_to_inbox"
          color="primary"
        />
        <Typography>
          Check your email for a message from us so we can confirm your address.
          Once you&apos;re done, you can close this tab.
        </Typography>
        <Typography>
          <Box component="span" color="tertiary.main">
            Conversation
          </Box>{" "}
          is a place to talk with classmates. Get ready!
        </Typography>
      </Paper>
    </Container>
  );
}
