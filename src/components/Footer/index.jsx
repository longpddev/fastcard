import React, { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="bg-slate-800 block-up">
      <div className="c-container min-h-[70px] py-4 flex items-center justify-center">
        <span>footer</span>
      </div>
    </footer>
  );
});

export default Footer;
