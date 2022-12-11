'use client';

import { IReactProps } from '@/interfaces/common';
import clsx from 'clsx';
import React from 'react';

const LoadingIcon: IReactProps = ({ className, ...props }) => (
  <i className={clsx('fas fa-spinner', className)} {...props}></i>
);

export default LoadingIcon;
