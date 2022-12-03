'use client';

import clsx from 'clsx';
import React from 'react';

const LoadingIcon = ({ className, ...props }) => (
  <i className={clsx('fas fa-spinner', className)} {...props}></i>
);

export default LoadingIcon;
