'use client';

import React, { useId } from 'react';

const TextareaField = ({ value, onChange, ...props }) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea
        cols="30"
        rows="10"
        value={value}
        className="input mt-1"
        id={id}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default TextareaField;
