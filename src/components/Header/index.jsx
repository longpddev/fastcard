import React, { memo } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-120.png";
import { useLogin } from "../../hooks/useLogin";
import { logout } from "../../services/auth/authSlice";
import IconCircle from "../IconCircle";
import { pushToast } from "../Toast";
import Submenu from "./Submenu";
const Header = memo(() => {
  const { isLogin } = useLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      path: "/video",
      label: "Video transcript",
      icon: "fab fa-youtube",
    },

    {
      path: "/account",
      label: "Account",
      icon: "fas fa-user-gear",
    },
    {
      path: "",
      label: "Logout",
      icon: "fa-solid fa-arrow-right-from-bracket",
      props: {
        onClick: () => {
          dispatch(logout());
          pushToast.success("Logout success");
        },
      },
    },
  ];
  return (
    <header className="header bg-slate-800 z-30 sticky top-0 shadow-sm shadow-black">
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
        <div
          className="group relative py-2"
          // force init element for submenu auto close
          key={Math.random().toString(32).slice(2, 7)}
        >
          {isLogin ? (
            <>
              <IconCircle
                className="fas fa-user-gear relative left-[2px] "
                wrapClass="block-up"
              ></IconCircle>
              <Submenu
                className="absolute right-0 group-hover:opacity-100 top-[85%] opacity-0 transition-all invisible group-hover:visible group-hover:top-full"
                list={menu}
              />
            </>
          ) : (
            <IconCircle
              onClick={() => navigate("/login")}
              className="fa-solid fa-arrow-right-to-bracket relative left-[2px] "
              wrapClass="block-up"
            ></IconCircle>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
