import React from "react";

const When = ({ component, if: condition, children, render, ...props }) => {
  const Component = component || React.Fragment;

  if (!condition) return null;
  const childrenIdFn = typeof children === "function";
  return (
    <Component {...props}>{childrenIdFn ? children() : children}</Component>
  );
};

export default When;
