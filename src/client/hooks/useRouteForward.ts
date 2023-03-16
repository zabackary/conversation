import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const isGoogle = "google" in window && "script" in window.google;

let changeHandlerSet = false;
export default function useRouteForward() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isGoogle) {
      google.script.history.replace(
        undefined,
        undefined,
        `${location.pathname}${location.search}${location.hash}`
      );
    }
  }, [location.hash, location.pathname, location.search]);
  useEffect(() => {
    if (!changeHandlerSet && isGoogle) {
      google.script.history.setChangeHandler((event) => {
        navigate(event.location.hash, { replace: true });
      });
      changeHandlerSet = true;
    }
  }, [navigate]);
}
