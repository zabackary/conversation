import { Button } from "@mui/material";
import { TFunction } from "i18next";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import MaterialSymbolIcon, {
  MaterialSymbolIconProps,
} from "../../components/MaterialSymbolIcon";

const endButtonMoveStyles = {
  "&:hover, &:focus": {
    "& .MuiButton-endIcon": {
      transform: "translateX(4px)",
    },
  },
  "& .MuiButton-endIcon": {
    transition: "transform 200ms",
  },
};

export interface Feature {
  name: string;
  description: string;
  icon: MaterialSymbolIconProps["icon"];
  action?: ReactNode;
}

const features: (t: TFunction<"landing">) => Feature[] = (
  t: TFunction<"landing">
) => [
  {
    name: t("why.simple.header"),
    description: t("why.simple.description"),
    icon: "shape_line",
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<MaterialSymbolIcon icon="arrow_forward" />}
        sx={endButtonMoveStyles}
      >
        {t("why.simple.callToAction")}
      </Button>
    ),
  },
  {
    name: t("why.safe.header"),
    description: t("why.safe.description"),
    icon: "shield",
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<MaterialSymbolIcon icon="arrow_forward" />}
        sx={endButtonMoveStyles}
      >
        {t("why.safe.callToAction")}
      </Button>
    ),
  },
  {
    name: t("why.beautiful.header"),
    description: t("why.beautiful.description"),
    icon: "palette",
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/settings/"
        endIcon={<MaterialSymbolIcon icon="arrow_forward" />}
        sx={endButtonMoveStyles}
      >
        {t("why.beautiful.callToAction")}
      </Button>
    ),
  },
  {
    name: t("why.powerful.title"),
    description: t("why.powerful.description"),
    icon: "bolt",
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<MaterialSymbolIcon icon="arrow_forward" />}
        sx={endButtonMoveStyles}
      >
        {t("why.powerful.callToAction")}
      </Button>
    ),
  },
];

export default features;
