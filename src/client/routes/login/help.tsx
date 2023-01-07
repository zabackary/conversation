import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginHelpRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Typography component="h1" variant="h5" mb="8px">
        Help
      </Typography>
      <Typography>
        Upon the alpha release of Conversation 4, this page will contain actual
        information. For now, I don&apos;t have the time to write a longer help
        page, so this one should suffice.
      </Typography>
      <Typography>
        To log in, navigate to the login page and enter your email &#8211;
        don&apos;t type to @stu.his.ac.jp part as it&apos;s already in the input
        box. To create an account, for now, fill out the create account form. In
        the future, you may be forced to confirm your email, but this is the
        beta release.
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
