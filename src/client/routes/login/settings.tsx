import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppearanceSettingsRoute from "../root/settings/appearance";

export default function LoginSettingsRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        Appearance settings
      </Typography>
      <AppearanceSettingsRoute noAppBar />
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
