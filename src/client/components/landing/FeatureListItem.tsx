import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Feature } from "../../routes/landing/features";

export interface FeatureListItemProps {
  feature: Feature;
}

export default function FeatureListItem({ feature }: FeatureListItemProps) {
  const IconComponent = feature.icon;
  return (
    <Grid item sm={6}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: "secondary.main", height: 64, width: 64 }}>
              <IconComponent fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3">{feature.name}</Typography>
              <Typography variant="body1" mb={feature.action ? 2 : 0}>
                {feature.description}
              </Typography>
              {feature.action}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
