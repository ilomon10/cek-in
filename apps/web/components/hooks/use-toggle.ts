import { useCallback, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export function useToggle<T = string>(
  defaultValue?: T
): [
  T | undefined,
  (value: T) => void,
  Dispatch<SetStateAction<T | undefined>>,
] {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  const toggle = useCallback((v: T) => {
    setValue((x) => (v !== x ? v : undefined));
  }, []);

  return [value, toggle, setValue];
}
