import { Fade } from "@mui/material";
import { useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import useRouteForward from "../../hooks/useRouteForward";

export default function LandingRootRoute() {
  useRouteForward();
  const [, match] = useMatches();
  const currentOutlet = useOutlet();
  return (
    <SwitchTransition>
      <Fade key={match.id} timeout={200} unmountOnExit>
        <div>{currentOutlet}</div>
      </Fade>
    </SwitchTransition>
  );
}
