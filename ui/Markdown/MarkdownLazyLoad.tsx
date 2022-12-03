'use client';

import React, { Suspense } from 'react';
import LoadingIcon from '../LoadingIcon';
const Lazy = React.lazy(() => import('./RandomName'));
const MarkdownLazyLoad = (props) => {
  const Loading = (
    <div className="flex w-full justify-center">
      <LoadingIcon></LoadingIcon>
    </div>
  );
  return (
    <Suspense fallback={Loading}>
      <Lazy {...props} />
    </Suspense>
  );
};

export default MarkdownLazyLoad;
