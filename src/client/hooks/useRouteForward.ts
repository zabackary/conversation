import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

let resolveUpdatedHash: (() => void) | undefined;

export const updatedHash = new Promise<void>((resolve) => {
  resolveUpdatedHash = resolve;
});

export const isGASWebApp = "google" in window && "script" in window.google;

let changeHandlerSet = false;
let hasFetchedLocation = false;
export default function useRouteForward() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isGASWebApp && hasFetchedLocation) {
      google.script.history.replace(
        undefined,
        undefined,
        `${location.pathname}${location.search}${location.hash}`
      );
    }
  }, [location.hash, location.pathname, location.search]);
  useEffect(() => {
    if (!changeHandlerSet && isGASWebApp) {
      google.script.history.setChangeHandler((event) => {
        navigate(event.location.hash, { replace: true });
      });
      google.script.url.getLocation((currentLocation) => {
        navigate(currentLocation.hash, { replace: true });
        hasFetchedLocation = true;
        if (resolveUpdatedHash) resolveUpdatedHash();
      });
      changeHandlerSet = true;
    }
  }, [navigate]);
}
