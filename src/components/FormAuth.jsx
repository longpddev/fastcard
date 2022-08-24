import React from "react";
import { Link, useNavigate } from "react-router-dom";

const FormAuth = ({ title, children, onSubmit }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center">
      <div className="rounded-lg overflow-hidden max-w-[500px] w-full max-h-full block-up p-4 bg-slate-800 ">
        <div className="flex">
          <Link to="#" onClick={() => navigate(-1)} title="go to home page">
            <i className="fas fa-arrow-left-long mt-1 relative left-0 hover:left-1 transition-all text-slate-400 active:left-0 mr-4 text-2xl cursor-pointer"></i>
          </Link>
          <h1 className="text-4xl font-semibold mb-6">{title}</h1>
        </div>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit && onSubmit();
          }}
        >
          {children}
        </form>
      </div>
    </div>
  );
};

export default FormAuth;
