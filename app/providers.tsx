'use client';

import { PropsWithChildren } from 'react';
import { store } from '../store/app';
import { Provider } from 'react-redux';
import { useRouter } from 'next/navigation';
import { globalNavigate } from '@/functions/common';
import ToastContainer from '@/ui/Toast/ToastContainer';
import PopupWordDefinitions from '@/ui/PopupWordDefinitions';
import PopupShortCutDetail from '@/ui/PopupShortCutDetail';
import Translation from '@/ui/Translation';
type P = PropsWithChildren;

export default function Providers({ children }: P) {
  const router = useRouter();
  // public router for everyone can use it
  globalNavigate.current = router;
  return (
    <Provider store={store}>
      <ToastContainer />
      <PopupWordDefinitions />
      <PopupShortCutDetail />
      <Translation />
      {children}
    </Provider>
  );
}
