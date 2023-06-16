import { Container, Paper, Typography } from "@mui/material";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function SetupAccountRoute() {
  useEffect(() => {
    void confetti();
  }, []);
  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 6, pb: 8 }}>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, md: 3 },
          borderRadius: 3,
        }}
      >
        <Typography component="h1" variant="h5" mb="8px">
          Let&apos;s get you set up.
        </Typography>
        <Typography>TODO</Typography>
      </Paper>
    </Container>
  );
}
