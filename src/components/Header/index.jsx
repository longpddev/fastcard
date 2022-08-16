import React, { memo } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-120.png";
import IconCircle from "../IconCircle";
import Submenu from "./Submenu";
const Header = memo(() => {
  useEffect(() => {
    console.count("header create");
  }, []);
  const menu = [
    {
      path: "/create-card",
      label: "Create Card",
      icon: "fa-brands fa-leanpub",
    },
    {
      path: "/list-card",
      label: "List Card",
      icon: "fas fa-list-ul",
    },
    {
      path: "/account-detail",
      label: "Account Detail",
      icon: "fas fa-user-gear",
    },
    {
      path: "/logout",
      label: "Logout",
      icon: "fa-solid fa-arrow-right-from-bracket",
    },
  ];
  return (
    <header className="header bg-slate-800 z-50 sticky top-0 shadow-sm shadow-black">
      <div className="flex c-container h-full ">
        <Link to="/">
          <img
            src={logo}
            width="100px"
            className="h-full object-contain py-2"
            height="100px"
            title="logo site"
            alt="logo site"
          />
        </Link>
        <div className="ml-auto py-2"></div>
        <div className="group relative py-2">
          <IconCircle className="fas fa-user-gear relative left-[2px]"></IconCircle>
          <Submenu
            className="absolute right-0 group-hover:opacity-100 top-[50%] opacity-0 transition-all invisible group-hover:visible group-hover:top-full"
            list={menu}
          />
        </div>
      </div>
    </header>
  );
});

export default Header;
