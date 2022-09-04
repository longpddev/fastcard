import React from "react";

const ContentTab = ({ children, onSubmit, onReset }) => {
  return (
    <>
      {children}
      {[onSubmit, onReset].filter(Boolean).length > 0 && (
        <div className="flex mt-6">
          {onReset && (
            <button className="button text-orange-400" onClick={onReset}>
              Reset
            </button>
          )}
          {onSubmit && (
            <button
              className="button text-green-400 ml-auto"
              onClick={onSubmit}
            >
              Submit
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ContentTab;
