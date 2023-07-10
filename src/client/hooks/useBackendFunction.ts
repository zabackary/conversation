import { useEffect, useMemo, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NetworkBackend, {
  LoggedOutException,
  Subscribable,
} from "../network/NetworkBackend";
import useBackend from "./useBackend";

export function useSubscribable<T>(getSubscribable: () => Subscribable<T>) {
  const subscribable = useMemo(getSubscribable, [getSubscribable]);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const unsubscribe = subscribable.subscribe(({ error }) => {
      if (error) {
        throw error;
      }
      forceUpdate();
    });
    return () => {
      unsubscribe();
    };
  }, [subscribable]);
  return subscribable.getMaybeSnapshot();
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
    if (
      navigateToLoginOnAuthFailure &&
      (value instanceof LoggedOutException || (isUser && value === null))
    ) {
      navigate(
        `/login/?next=${encodeURIComponent(
          location.pathname + location.hash + location.search
        )}`,
        {
          replace: true,
        }
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
