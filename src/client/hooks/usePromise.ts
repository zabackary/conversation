import { useEffect, useMemo, useState } from "react";

export default function usePromise<T>(
  promiseFactory: () => Promise<T>
): T | null {
  const [value, setValue] = useState<{ value: T } | { error: unknown } | null>(
    null
  );
  const promise = useMemo(() => {
    return promiseFactory();
  }, [promiseFactory]);
  useEffect(() => {
    promise
      .then((newValue) => {
        setValue({ value: newValue });
      })
      .catch((e) => {
        setValue({ error: e });
      });
  }, [promise]);
  if (value && "error" in value) {
    throw value.error;
  } else if (value && "value" in value) {
    return value.value;
  } else {
    return null;
  }
}
