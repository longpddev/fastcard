'use client';

import React from 'react';
import Link from 'next/link';

const Submenu = ({ className = '', list = [], ...props }) => {
  return (
    <div
      className={`${className} submenu block-up w-max overflow-hidden rounded-md bg-slate-800`}
      {...props}
    >
      <ul>
        {list.map((item) =>
          item.path ? (
            <li className="" key={item.path}>
              <Link
                className="link flex items-center whitespace-nowrap border-t border-slate-900 py-2 px-6 transition-all hover:bg-slate-700"
                href={item.path}
                {...item.props}
              >
                {item.icon && (
                  <i className={`${item.icon} mr-3 text-slate-300`}></i>
                )}
                <span>{item.label}</span>
              </Link>
            </li>
          ) : (
            <li className="" key={item.path}>
              <button
                className="link flex w-full items-center whitespace-nowrap border-t border-slate-900 py-2 px-6 transition-all hover:bg-slate-700"
                {...item.props}
              >
                {item.icon && (
                  <i className={`${item.icon} mr-3 text-slate-300`}></i>
                )}
                <span>{item.label}</span>
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default Submenu;
