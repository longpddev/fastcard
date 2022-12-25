'use client';

import { CARD_LIST_PAGE } from '@/constants/page';
import { run } from '@/functions/common';
import { IReactProps } from '@/interfaces/common';
import Breadcrumb from '@/ui/Breadcrumb';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import CreateQuestionAnswer from './CreateQuestionAnswer';
import CreateQuestionAnswerExplain from './CreateQuestionAnswerExplain';

const ChoiceType: IReactProps<{
  type: string;
  searchParams: ReturnType<typeof useSearchParams>;
}> = ({ type, searchParams }) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <Breadcrumb paths={[CARD_LIST_PAGE]} />
      <div className="block-up mb-6 flex rounded-md bg-slate-800 px-4 py-3">
        <label
          htmlFor=""
          className="mr-4 self-center whitespace-nowrap text-xl text-slate-300"
        >
          Select type
        </label>
        <select
          name=""
          id=""
          value={type}
          className="input"
          onChange={(e) => {
            const cloneQuery = new URLSearchParams(searchParams);
            cloneQuery.set('type', e.target.value);
            router.push(pathname + '?' + cloneQuery.toString());
            return cloneQuery;
          }}
        >
          <option value="" disabled>
            select type
          </option>
          <option value="explain">card explain</option>
          <option value="noexplain">no card explain</option>
        </select>
      </div>
    </>
  );
};
const page = () => {
  const searchParams = useSearchParams();

  switch (searchParams.get('type')) {
    case 'explain':
      return (
        <>
          <ChoiceType
            type={searchParams.get('type') || ''}
            searchParams={searchParams}
          />
          <CreateQuestionAnswerExplain></CreateQuestionAnswerExplain>
        </>
      );
    case 'noexplain':
      return (
        <>
          <ChoiceType
            type={searchParams.get('type') || ''}
            searchParams={searchParams}
          />
          <CreateQuestionAnswer />
        </>
      );
    default:
      return (
        <ChoiceType
          type={searchParams.get('type') || ''}
          searchParams={searchParams}
        />
      );
  }
};
export default page;
