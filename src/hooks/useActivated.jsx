import { useCallback, useRef, useState } from "react";

// use to check component first active or not
// example input not active and when user click it then it will active
export default function useActivated() {
  const ref = useRef();
  const [state, setState] = useState(false);
  ref.current = state;
  return {
    onActive: useCallback(() => setState(true), []),
    isActivated: useCallback(() => ref.current, []),
  };
}
