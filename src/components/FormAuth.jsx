import React from "react";
import { Link } from "react-router-dom";

const FormAuth = ({ title, children }) => {
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center">
      <div className="rounded-lg overflow-hidden max-w-[500px] w-full max-h-full shadow-lg shadow-top p-4 bg-slate-800 shadow-black">
        <div className="flex">
          <Link to={"/"} title="go to home page">
            <i className="fas fa-arrow-left-long mt-1 relative left-0 hover:left-1 transition-all text-slate-400 active:left-0 mr-4 text-2xl cursor-pointer"></i>
          </Link>
          <h1 className="text-4xl font-semibold mb-6">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormAuth;
