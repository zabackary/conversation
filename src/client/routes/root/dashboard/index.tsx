import { Box, Card, CardContent, Typography } from "@mui/material";
import { PrivilegeLevel } from "../../../../model/user";
import MaterialSymbolIcon from "../../../components/MaterialSymbolIcon";
import useUser from "../../../hooks/useUser";

export default function DashboardRoute() {
  const user = useUser();
  return (
    <Box p={3} width="100%">
      <Typography component="h1" variant="h3" my={2}>
        Dashboard
      </Typography>
      <Typography component="h2" variant="h5" my={2}>
        Alerts
      </Typography>
      {APP_CONFIG.alert !== "" ? (
        <Card sx={{ mb: 1 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              <MaterialSymbolIcon
                icon="notifications"
                size={14}
                sx={{ mr: 0.5 }}
              />
              App status
            </Typography>
            <Typography variant="h5" component="div" mb={1.5}>
              New alert
            </Typography>
            <Typography variant="body2">{APP_CONFIG.alert}</Typography>
          </CardContent>
        </Card>
      ) : null}
      {user?.privilegeLevel === PrivilegeLevel.UNVERIFIED ? (
        <Card sx={{ mb: 1 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              <MaterialSymbolIcon icon="lightbulb" size={14} sx={{ mr: 0.5 }} />
              Tips
            </Typography>
            <Typography variant="h5" component="div" mb={1.5}>
              You seem new.
            </Typography>
            <Typography variant="body2">
              Why don&apos;t you go join a channel?
            </Typography>
            <ol>
              <li>Click &quot;Channels&quot;</li>
              <li>Click &quot;Join channel&quot;</li>
              <li>Find a public channel</li>
              <li>Scroll down and find the Main Channel to join!</li>
            </ol>
          </CardContent>
        </Card>
      ) : null}
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <MaterialSymbolIcon
              icon="new_releases"
              size={14}
              sx={{ mr: 0.5 }}
            />
            What&apos;s new
          </Typography>
          <Typography variant="h5" component="div" mb={1.5}>
            Changelog for June 17th, 2023
          </Typography>
          <Typography variant="body2">
            The following changes and many more were made:
          </Typography>
          <ul>
            <li>Added this dashboard page</li>
            <li>Improved the onboarding flow</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
