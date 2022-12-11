'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { store } from '../store/app';
import { Provider } from 'react-redux';
type P = PropsWithChildren;

export default function Providers({ children }: P) {
  return <Provider store={store}>{children}</Provider>;
}
