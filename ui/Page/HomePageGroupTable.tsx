'use client';

import { groupCardSelector } from '@/services/card/cardSlice';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/app';

const HomePageGroupTable = () => {
  const groupList = useSelector(groupCardSelector);

  return (
    <>
      {groupList.map((item) => (
        <GroupRow groupId={item.id} name={item.name} key={item.id} />
      ))}
    </>
  );
};

const GroupRow = ({ groupId, name }: { groupId: number; name: string }) => {
  const result = useSelector(
    (s: RootState) => s.card.learnToday.entities[groupId],
  );

  return (
    <tr>
      <td className="">
        <Link href={`/learn/${groupId}`}>{name}</Link>
      </td>
      <td className="text-center ">
        {result ? (
          <>
            <span className="text-green-400">{result.card.rows.length}</span>
            &nbsp;
            <span className="text-gray-400">in</span>&nbsp;
            <span className="text-sky-400">{result.card.count}</span>
          </>
        ) : null}
      </td>
    </tr>
  );
};

export default HomePageGroupTable;
