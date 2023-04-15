import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NetworkBackend, {
  LoggedOutException,
  Subscribable,
} from "../network/NetworkBackend";
import useBackend from "./useBackend";

export function useSubscribable<T>(getSubscribable: () => Subscribable<T>) {
  const subscribable = useMemo(getSubscribable, [getSubscribable]);
  // TODO: Figure out how to use `useSyncExternalStore`; it doesn't work and I don't know why
  // Possiblely I need to use `structuredClone` or something and caching?
  const [value, setValue] = useState<T | Error | null>(
    subscribable.getSnapshot()
  );
  useEffect(() => {
    const unsubscribe = subscribable.subscribe((newValue) => {
      setValue(newValue);
    });
    return () => {
      unsubscribe();
    };
  }, [subscribable]);
  return value;
}

export default function useBackendFunction<T>(
  getSubscribable: (backend: NetworkBackend) => Subscribable<T>,
  navigateToLoginOnAuthFailure: boolean,
  isUser?: boolean
) {
  const backend = useBackend();
  const value = useSubscribable(() => getSubscribable(backend));
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (navigateToLoginOnAuthFailure && value instanceof LoggedOutException) {
      navigate(
        `/login/?next=${encodeURIComponent(
          location.pathname + location.hash + location.search
        )}`
      );
    }
  }, [
    value,
    navigateToLoginOnAuthFailure,
    navigate,
    location.pathname,
    location.hash,
    location.search,
    isUser,
  ]);
  if (value instanceof Error) {
    if (value instanceof LoggedOutException) {
      return null;
    }
    throw value;
  }
  return value;
}
