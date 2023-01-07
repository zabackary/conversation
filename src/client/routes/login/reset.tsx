import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginResetRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        Reset password
      </Typography>
      <Typography>
        Upon the alpha release of Conversation 4, this page will contain actual
        information. For now, I don&apos;t have the time to write a longer help
        page, so this one should suffice.
      </Typography>
      <Typography>
        Currently, you are <u>unable to reset your password</u> through the
        system. Please contact the developer instead.
      </Typography>
      <Grid container width="100%">
        <Grid item xs>
          <Button
            onClick={() => navigate(-1)}
            variant="tonal"
            sx={{ mt: 3, mb: 2 }}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
