'use client';

import React, { useId } from 'react';
import { IReactProps } from '@/interfaces/common';

const SelectField: IReactProps<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<[string, string]>;
}> = ({ label, value, options, onChange, ...props }) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="input mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options.map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectField;
