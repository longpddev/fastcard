'use client';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FormAuth = ({ title, children, onSubmit }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center px-4">
      <div className="block-up max-h-full w-full max-w-[500px] overflow-hidden rounded-lg bg-slate-800 p-4 ">
        <div className="flex">
          <Link to="#" onClick={() => navigate(-1)} title="go to home page">
            <i className="fas fa-arrow-left-long relative left-0 mt-1 mr-4 cursor-pointer text-2xl text-slate-400 transition-all hover:left-1 active:left-0"></i>
          </Link>
          <h1 className="mb-6 text-4xl font-semibold">{title}</h1>
        </div>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit && onSubmit();
          }}
        >
          {children}
        </form>
      </div>
    </div>
  );
};

export default FormAuth;
