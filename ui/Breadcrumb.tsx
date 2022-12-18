'use client';

import { IReactProps } from '@/interfaces/common';
import Link from 'next/link';
import React from 'react';

export type BreadcrumbPath = {
  name: string;
  path: string;
};

const Breadcrumb: IReactProps<{
  paths?: Array<BreadcrumbPath>;
}> = ({ paths = [] }) => {
  const newPath: Array<BreadcrumbPath> = [
    {
      name: 'home',
      path: '/',
    },
    ...paths,
  ];
  return (
    <div className="mb-6 mt-2 bg-slate-800 p-2">
      <ul className="flex  ">
        {newPath.map((item, i) => (
          <li key={i}>
            {i === 0 ? (
              <Link href={item.path}>
                <i className="fas fa-house"></i>
              </Link>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
            {i !== newPath.length - 1 && (
              <i className="fas fa-chevron-right mx-3 inline-block text-sm text-slate-500"></i>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
