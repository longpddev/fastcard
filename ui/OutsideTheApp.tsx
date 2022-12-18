'use client';

import { IReactProps } from '@/interfaces/common';
import { createPortal } from 'react-dom';

const OutsideTheApp: IReactProps = ({ children }) => {
  if (typeof document === 'undefined') return <>{children}</>;
  return createPortal(
    children,
    document.fullscreenElement ? document.fullscreenElement : document.body,
  );
};

export default OutsideTheApp;
