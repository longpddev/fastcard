import { useCallback, useRef } from "react";
import useActivated from "./useActivated";

export const useValidate = () => {
  const validObject = useRef({});
  const prevValCheck = useRef({});
  const { onActive, isActivated } = useActivated();
  return {
    plug: useCallback(
      { globe: validObject, isActivated: isActivated, prevValCheck },
      []
    ),
    onSubmit:
      (handle) =>
      (...argus) => {
        onActive();
        if (!Object.values(validObject.current).every((i) => i)) return;
        handle(...argus);
      },
  };
};
