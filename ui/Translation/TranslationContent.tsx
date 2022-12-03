'use client';

import { firstCapitalize } from '@/functions/common';
import React from 'react';
import FindImageByWords from '@/ui/FindImageByWords/index';

const TranslationContent = ({ data, originText }) => {
  return (
    <div className="p-4">
      <h2 className=" px-4 text-center text-2xl font-medium text-sky-400">
        {firstCapitalize(originText)}
      </h2>
      <h3 className="mb-4 text-xl text-slate-600">
        Meaning: &nbsp;
        <span className="text-slate-300">
          {data.translations.reduce((acc, item) => {
            const text = firstCapitalize(item.translatedText);
            if (!acc) return text;
            return acc + ', ' + text;
          }, '')}
        </span>
      </h3>
      <div className="max-h-[300px] overflow-auto" tabIndex={0}>
        <FindImageByWords words={originText} />
      </div>
    </div>
  );
};

export default TranslationContent;
