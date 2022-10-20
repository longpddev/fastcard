import React, { Children } from "react";

const HeaderPage = ({ title, children }) => {
  const newChild = Children.map(children, (child) => (
    <li className="ml-2">{child}</li>
  ));
  return (
    <div className="flex mb-6 items-center border-b-2 pb-4 border-slate-800">
      <h1 className="text-2xl text-center font-medium text-slate-200">
        {title}
      </h1>
      <ul className="ml-auto flex">{newChild}</ul>
    </div>
  );
};

export default HeaderPage;
