'use client';

import React, { useId } from 'react';

const NumberField = ({ label, value, onChange, ...props }) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        id={id}
        className="input mt-1"
        value={value.toString()}
        onChange={(e) => onChange(parseInt(e.target.value))}
        {...props}
      />
    </>
  );
};

export default NumberField;
