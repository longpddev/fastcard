import '@/styles/dist.css';
import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return <main className="c-container relative pb-10">{children}</main>;
}

export default Layout;
