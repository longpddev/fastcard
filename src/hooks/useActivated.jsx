import { useRef } from "react";

// use to check component first active or not
// example input not active and when user click it then it will active
export default function useActivated() {
  const ref = useRef(false);
  return {
    onActive: () => (ref.current = true),
    isActivated: () => ref.current,
  };
}
