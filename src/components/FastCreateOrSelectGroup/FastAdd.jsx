import React, { useEffect, useRef, useState } from "react";
import { clientAuth } from "../../api/client";
import { pushToast } from "../Toast/core";
const FastAdd = ({ onClose, ...props }) => {
  const inputRef = useRef();
  const [value, valueSet] = useState("");
  const handleAdd = () => {
    const val = value.trim();
    if (val.length === 0) {
      shake();
      pushToast.warning("Please fill name of group");
      return;
    }

    clientAuth
      .POST("/card-group", {
        body: {
          name: value,
        },
      })
      .then(() => {
        pushToast.success("Create success");
        valueSet("");
        onClose && onClose();
      })
      .catch((e) => {
        console.error(e);
        pushToast.error("Create error please try again");
      });
  };
  const shake = () => {
    inputRef.current.classList.add("shake-animate");
  };

  useEffect(() => {
    const element = inputRef.current;
    const handle = (e) => {
      element.classList.remove("shake-animate");
    };
    element.addEventListener("animationend", handle);

    return () => {
      element.removeEventListener("animationend", handle);
    };
  }, []);
  return (
    <div className="flex mt-4" {...props}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => valueSet(e.target.value)}
        className="relative transition-all left-0 right-0"
      />
      <button onClick={handleAdd} className="button text-sm ml-2">
        Add
      </button>
    </div>
  );
};

export default FastAdd;
