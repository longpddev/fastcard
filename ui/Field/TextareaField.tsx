'use client';

import React, { useId } from 'react';
import { IReactProps } from '@/interfaces/common';

const TextareaField: IReactProps<{
  value: string;
  label: string;
  onChange: (v: string) => void;
}> = ({ value, label, onChange }) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea
        cols={30}
        rows={10}
        value={value}
        className="input mt-1"
        id={id}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default TextareaField;
