'use client';

import React, { useId } from 'react';
import { IReactProps } from '@/interfaces/common';

const StringField: IReactProps<{
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
      <input
        type="number"
        id={id}
        className="input mt-1"
        value={value.toString()}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </>
  );
};

export default StringField;
