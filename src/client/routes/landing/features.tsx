import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import PaletteIcon from "@mui/icons-material/Palette";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";
import ShieldIcon from "@mui/icons-material/Shield";
import { Button } from "@mui/material";
import { ReactNode } from "react";
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

const features: Feature[] = [
  {
    name: "Simple",
    description:
      "Anytime, anywhere. Even on a school chromebook. Conversation utilizes Google Scripts for uncensorable communication.",
    icon: ShapeLineIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        Create account
      </Button>
    ),
  },
  {
    name: "Safe",
    description:
      "Built to be moderated, from the ground up. State-of-the-art automated filtering combined with real humans can catch everything.",
    icon: ShieldIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        Let&apos;s go
      </Button>
    ),
  },
  {
    name: "Beautiful",
    // Translation note: "pretty pretty" is an English-specific joke. Replace with something else or remove.
    description:
      "Wonderfully designed using Google's latest styles. Pretty pretty, if you know what I mean.",
    icon: PaletteIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/settings/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        Try it out
      </Button>
    ),
  },
  {
    name: "Powerful",
    description:
      "Easily invite members and chat using not just text but images, bots, and more.",
    icon: BoltIcon,
    action: (
      <Button
        variant="filled"
        component={Link}
        to="/login/new/"
        endIcon={<ArrowForwardIcon />}
        sx={endButtonMoveStyles}
      >
        Experiment
      </Button>
    ),
  },
];

export default features;
