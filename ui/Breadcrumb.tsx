'use client';

import React from 'react';
import { Link } from 'react-router-dom';

/**
 *
 * @param {{ path: Array<{name, path}>}} param0
 * @returns
 */
const Breadcrumb = ({ paths = [] }) => {
  const newPath = [
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
              <Link to={item.path}>
                <i className="fas fa-house"></i>
              </Link>
            ) : (
              <Link to={item.path}>{item.name}</Link>
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
