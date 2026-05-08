import { useState, useCallback } from "react";

/**
 * A generic hook to handle localStorage boolean values.
 */
export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = true,
) {
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultValue;
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return storedValue === "true";
    }
    localStorage.setItem(key, String(defaultValue));
    return defaultValue;
  });

  const update = useCallback(
    (newValue: boolean) => {
      setValue(newValue);
      localStorage.setItem(key, String(newValue));
    },
    [key],
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const next = !prev;
      localStorage.setItem(key, String(next));
      return next;
    });
  }, [key]);

  const isTrue = useCallback((): boolean => {
    return value;
  }, [value]);

  return {
    value,
    update,
    remove,
    toggle,
    isTrue,
  };
}
