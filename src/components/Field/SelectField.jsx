import React, { useId } from "react";

const SelectField = ({ label, value, options, onChange, ...props }) => {
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
          <option value={key}>{value}</option>
        ))}
      </select>
    </>
  );
};

export default SelectField;
