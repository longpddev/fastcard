'use client';

import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="block-up bg-slate-800">
      <div className="c-container flex min-h-[70px] items-center justify-center py-4">
        <span>footer</span>
      </div>
    </footer>
  );
});

export default Footer;