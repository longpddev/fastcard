import { KEY_NAME, SPECIAL_KEY } from "@/constants/index";
import React, { useState } from "react";
import useShortcut from "@hooks/useShortcut";
import PopupWordDefinitionsPopup from "./PopupWordDefinitionsPopup";
import IconCircle from "../IconCircle";

const PopupWordDefinitions = () => {
  const [open, openSet] = useState(false);
  useShortcut(SPECIAL_KEY.Ctrl + "s", (e) => {
    e.preventDefault();
    openSet(true);
  });
  return (
    <>
      {open && <PopupWordDefinitionsPopup onClose={() => openSet(false)} />}
      <button
        className="fixed right-5 bottom-5 z-10"
        onClick={() => openSet(true)}
      >
        <IconCircle
          className="fa-solid fa-language"
          wrapClass="active:text-sky-400 overflow-hidden"
        ></IconCircle>
      </button>
    </>
  );
};

export default PopupWordDefinitions;
