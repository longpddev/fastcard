import React, { useId } from "react";
import MarkDown from "../Markdown";
const MarkDownField = ({ label, value, onChange, ...props }) => {
  const id = useId();
  return (
    <>
      <label className="mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="flex flex-wrap mt-1">
        <textarea
          cols="30"
          rows="10"
          className="input md:w-1/2 w-full"
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
