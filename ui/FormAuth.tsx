'use client';

import { IReactProps } from '@/interfaces/common';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const FormAuth: IReactProps<{
  title: string;
  onSubmit: () => void;
}> = ({ title, children, onSubmit }) => {
  const router = useRouter();
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center px-4">
      <div className="block-up max-h-full w-full max-w-[500px] overflow-hidden rounded-lg bg-slate-800 p-4 ">
        <div className="flex">
          <Link href="#" onClick={() => router.back()} title="go to home page">
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