import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function LoginResetRoute() {
  const navigate = useNavigate();
  const { t } = useTranslation("login");
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        {t("footer.forgot")}
      </Typography>
      <Typography>
        [untranslated] I&apo;m working on a reset password page. Until then, ask
        me; I can do it for you.
      </Typography>
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
