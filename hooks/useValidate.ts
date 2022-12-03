'use client';

import { useRef, useMemo } from 'react';
import useActivated from './useActivated';

export const useValidate = () => {
  const validObject = useRef({});
  const prevValCheck = useRef({});
  const { onActive, isActivated } = useActivated();
  return {
    plug: useMemo(
      () => ({ globe: validObject, isActivated: isActivated, prevValCheck }),
      [],
    ),
    onSubmit:
      (handle: (...argus: any) => void) =>
      (...argus: any) => {
        onActive();
        if (!Object.values(validObject.current).every((i) => i)) return;
        handle(...argus);
      },
  };
};
