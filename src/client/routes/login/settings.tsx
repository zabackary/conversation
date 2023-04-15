import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppearanceSettingsRoute from "../root/settings/appearance";

export default function LoginSettingsRoute() {
  const navigate = useNavigate();
  const { t } = useTranslation("login");
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        {t("footer.appearance")}
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
            {t("back")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
