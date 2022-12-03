'use client';

import { useCallback, useRef, useState } from 'react';

// use to check component first active or not
// example input not active and when user click it then it will active
export default function useActivated() {
  const ref = useRef<boolean>();
  const [state, setState] = useState<boolean>(false);
  ref.current = state;
  return {
    onActive: useCallback(() => setState(true), []),
    isActivated: useCallback(() => ref.current, []),
  };
}
