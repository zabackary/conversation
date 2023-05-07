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
import MaterialSymbolIcon from "../MaterialSymbolIcon";

export interface FeatureListItemProps {
  feature: Feature;
}

export default function FeatureListItem({ feature }: FeatureListItemProps) {
  return (
    <Grid item sm={6}>
      <Card variant="filled">
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: "secondary.main", height: 64, width: 64 }}>
              <MaterialSymbolIcon icon={feature.icon} size={48} />
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
