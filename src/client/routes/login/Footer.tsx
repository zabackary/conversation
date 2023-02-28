import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box>
      <Link
        component={RouterLink}
        to={`/login/passwordreset/${window.location.search}`}
        variant="body2"
      >
        Forgot password?
      </Link>{" "}
      -{" "}
      <Link
        component={RouterLink}
        to={`/login/help/${window.location.search}`}
        variant="body2"
      >
        Help
      </Link>{" "}
      -{" "}
      <Link
        component={RouterLink}
        to={`/login/settings/${window.location.search}`}
        variant="body2"
      >
        Appearance preferences
      </Link>
    </Box>
  );
}
