'use client';

import { IReactProps } from '@/interfaces/common';
import React from 'react';

const VideoViewer: IReactProps = (props) => {
  return <video {...props}></video>;
};

export default VideoViewer;
