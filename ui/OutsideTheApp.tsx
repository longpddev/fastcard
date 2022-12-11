'use client';

import { IReactProps } from '@/interfaces/common';
import { createPortal } from 'react-dom';

const OutsideTheApp: IReactProps = ({ children }) =>
  createPortal(
    children,
    document.fullscreenElement ? document.fullscreenElement : document.body,
  );

export default OutsideTheApp;
