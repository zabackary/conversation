import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useRouteForward() {
  const location = useLocation();
  useEffect(() => {
    if ("google" in window && "script" in window.google) {
      google.script.history.replace(
        undefined,
        undefined,
        `${location.pathname}${location.search}${location.hash}`
      );
    }
  }, [location.hash, location.pathname, location.search]);
}
