import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import PaletteIcon from "@mui/icons-material/Palette";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";
import ShieldIcon from "@mui/icons-material/Shield";
import { Button } from "@mui/material";
import { TFunction } from "i18next";
import { ReactNode } from "react";
import { UseTranslationResponse } from "react-i18next";
import { Link } from "react-router-dom";

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
  icon: typeof ShapeLineIcon;
  action?: ReactNode;
}

const features: (t: TFunction<"landing">) => Feature[] = (
  t: TFunction<"landing">
) => [
  {
    name: t("why.simple.header"),
    description: t("why.simple.description"),
    icon: ShapeLineIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        {t("why.simple.callToAction")}
      </Button>
    ),
  },
  {
    name: t("why.safe.header"),
    description: t("why.safe.description"),
    icon: ShieldIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        {t("why.safe.callToAction")}
      </Button>
    ),
  },
  {
    name: t("why.beautiful.header"),
    description: t("why.beautiful.description"),
    icon: PaletteIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/settings/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        {t("why.beautiful.callToAction")}
      </Button>
    ),
  },
  {
    name: t("why.powerful.title"),
    description: t("why.powerful.description"),
    icon: BoltIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        {t("why.powerful.callToAction")}
      </Button>
    ),
  },
];

export default features;
