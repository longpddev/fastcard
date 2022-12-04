'use client';

import React, { useId } from 'react';
import MarkDown from '../Markdown';
import { IReactProps } from '@/interfaces/common';
const MarkDownField: IReactProps<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange, ...props }) => {
  const id = useId();
  return (
    <>
      <label className="mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="mt-1 flex flex-wrap">
        <textarea
          cols={30}
          rows={10}
          className="input w-full md:w-1/2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        <MarkDown>{value}</MarkDown>
      </div>
    </>
  );
};

export default MarkDownField;
