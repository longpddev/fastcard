import React from "react";
import image from "../assets/404.png";

const NotFound = () => {
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center">
      <img src={image} alt="" className="max-w-full max-h-full px-4" />
    </div>
  );
};

export default NotFound;
