'use client';

import { ICroppedImage } from '@/interfaces/common';
import { useState } from 'react';

interface IFormData {
  fileImage: ICroppedImage | undefined;
  detail: string;
}

export const creatorFormData = <C extends Record<string, string>>(
  CARD_TYPE: C,
) => {
  const initState = () => {
    return Object.keys(CARD_TYPE).reduce((acc, key) => {
      acc[key as keyof C] = {
        fileImage: undefined,
        detail: '',
      };

      return acc;
    }, {} as Record<keyof C, IFormData>);
  };
  return () => {
    const [data, setData] = useState(initState);
    return {
      getData: <F extends keyof IFormData>(
        tab: keyof C,
        field: F,
      ): IFormData[F] => data[tab][field],
      setData: (tab: keyof C, field: 'fileImage' | 'detail', value: any) => {
        setData((prev) => {
          if (prev[tab][field] === value) return prev;

          return {
            ...prev,
            [tab]: {
              ...prev[tab],
              [field]: value,
            },
          };
        });
      },
      reset: () => setData(initState()),
    };
  };
};
