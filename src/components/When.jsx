import React from "react";

const When = ({ component, if: condition, ...props }) => {
  const Component = component || React.Fragment;

  if (!condition) return null;

  return <Component {...props}>{props.children}</Component>;
};

export default When;
