import { KEY_NAME, SPECIAL_KEY } from "@/constants/index";
import React, { useState } from "react";
import useShortcut from "@hooks/useShortcut";
import PopupWordDefinitionsPopup from "./PopupWordDefinitionsPopup";
import IconCircle from "../IconCircle";
import { useLogin } from "@hooks/useLogin";
import ButtonShortCut from "@components/ButtonShortCut";

const PopupWordDefinitions = () => {
  const [open, openSet] = useState(false);
  const { isLogin } = useLogin();

  if (!isLogin) return null;
  return (
    <>
      {open && <PopupWordDefinitionsPopup onClose={() => openSet(false)} />}
      <div className="fixed right-5 bottom-5 z-10">
        <ButtonShortCut
          shortcut={SPECIAL_KEY.Ctrl + "s"}
          className="rounded-full"
          onClick={() => openSet(true)}
        >
          <IconCircle
            className="fa-solid fa-book"
            wrapClass="active:text-sky-400 overflow-hidden"
          ></IconCircle>
        </ButtonShortCut>
      </div>
    </>
  );
};

export default PopupWordDefinitions;
