import { useEffect, useMemo, useState } from "react";

export default function usePromise<T>(promiseFactory: () => Promise<T>) {
  const [value, setValue] = useState<T | null>(null);
  const promise = useMemo(() => {
    return promiseFactory();
  }, [promiseFactory]);
  useEffect(() => {
    promise
      .then((newValue) => {
        setValue(newValue);
      })
      .catch((e) => {
        setValue(null);
        throw e;
      });
  }, [promise]);
  return value;
}
