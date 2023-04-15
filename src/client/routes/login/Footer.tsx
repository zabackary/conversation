import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("login");
  return (
    <Box textAlign="left">
      <Link
        component={RouterLink}
        to={`/login/passwordreset/${window.location.search}`}
        variant="body2"
      >
        {t("footer.forgot")}
      </Link>{" "}
      -{" "}
      <Link
        component={RouterLink}
        to={`/login/help/${window.location.search}`}
        variant="body2"
      >
        {t("footer.help")}
      </Link>{" "}
      -{" "}
      <Link
        component={RouterLink}
        to={`/login/settings/${window.location.search}`}
        variant="body2"
      >
        {t("footer.appearance")}
      </Link>
    </Box>
  );
}
