import { Fade } from "@mui/material";
import { useEffect } from "react";
import { useMatches, useNavigate, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import useBackendAttributes from "../../hooks/useBackendAttributes";
import useRouteForward from "../../hooks/useRouteForward";

export default function LandingRootRoute() {
  useRouteForward();
  const [, match] = useMatches();
  const currentOutlet = useOutlet();
  const attributes = useBackendAttributes();
  const navigate = useNavigate();
  useEffect(() => {
    if (attributes?.onboarding) {
      navigate("/account_setup", { replace: true });
    } else if (attributes?.recovery) {
      // TODO: Add password recovery page
      navigate("/password_recovery", { replace: true });
    }
  }, [navigate, attributes?.onboarding, attributes?.recovery]);
  return (
    <SwitchTransition>
      <Fade key={match?.id} timeout={200} unmountOnExit>
        <div>{currentOutlet}</div>
      </Fade>
    </SwitchTransition>
  );
}
