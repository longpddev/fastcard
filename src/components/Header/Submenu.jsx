import React from "react";
import { NavLink } from "react-router-dom";

const Submenu = ({ className = "", list = [], ...props }) => {
  return (
    <div
      className={`${className} w-max submenu rounded-md overflow-hidden bg-slate-800 block-up`}
      {...props}
    >
      <ul>
        {list.map((item) =>
          item.path ? (
            <li className="" key={item.path}>
              <NavLink
                className="py-2 px-6 flex items-center transition-all border-t border-slate-900 hover:bg-slate-700 link whitespace-nowrap"
                to={item.path}
                {...item.props}
              >
                {item.icon && (
                  <i className={`${item.icon} mr-3 text-slate-300`}></i>
                )}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ) : (
            <li className="" key={item.path}>
              <button
                className="py-2 px-6 flex items-center transition-all w-full border-t border-slate-900 hover:bg-slate-700 link whitespace-nowrap"
                {...item.props}
              >
                {item.icon && (
                  <i className={`${item.icon} mr-3 text-slate-300`}></i>
                )}
                <span>{item.label}</span>
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Submenu;
