'use client';

import React, { Suspense } from 'react';

const PopupLazy = React.lazy(() => import('./PopupLazy'));
const Popup = (props) => {
  return (
    <Suspense fallback={null}>
      <PopupLazy {...props} />
    </Suspense>
  );
};

export default Popup;
