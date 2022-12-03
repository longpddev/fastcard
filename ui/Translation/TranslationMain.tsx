'use client';

import { SPECIAL_KEY } from '@/constants/index';
import ButtonShortCut from '@/ui/ButtonShortCut';
import IconCircle from '@/ui/IconCircle';
import { useLogin } from '@/hooks/useLogin';
import React from 'react';
import { useState } from 'react';
import TranslationPopup from './TranslationPopup';

const TranslationMain = () => {
  const [open, openSet] = useState(false);
  const { isLogin } = useLogin();

  if (!isLogin) return null;
  return (
    <>
      {open ? <TranslationPopup onClose={() => openSet(false)} /> : null}
      <div className="fixed right-5 bottom-[4.5rem] z-10">
        <ButtonShortCut
          shortcut={SPECIAL_KEY.Ctrl + 't'}
          className="rounded-full"
          onClick={() => openSet(true)}
        >
          <IconCircle
            className="fa-solid fa-language"
            wrapClass="active:text-sky-400 overflow-hidden"
          ></IconCircle>
        </ButtonShortCut>
      </div>
    </>
  );
};

export default TranslationMain;
