'use client';

import { createPortal } from 'react-dom';

const OutsideTheApp = ({ children }) =>
  createPortal(
    children,
    document.fullscreenElement ? document.fullscreenElement : document.body,
  );

export default OutsideTheApp;
