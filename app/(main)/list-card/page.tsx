'use client';

import Breadcrumb from '@/ui/Breadcrumb';
import HeaderPage from '@/ui/HeaderPage';
import PageTab from '@/ui/PageTab';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/app';
import ShowListCardOfGroup from './ShowListCardOfGroup';

const page = () => {
  const groupCard = useSelector((s: RootState) => s.card.groupCard);
  const groupCardList = useMemo(
    () => groupCard.ids.map((id) => groupCard.entities[id]),
    [groupCard],
  );
  return (
    <>
      <Breadcrumb />
      <HeaderPage title="List card"></HeaderPage>
      <PageTab
        typeStep={false}
        key={groupCardList.length}
        onSubmit={() => {}}
        defaultActive={groupCardList?.[0]?.id.toString()}
      >
        {groupCardList
          .map((item) => (
            <PageTab.Title key={item.id} tabKey={item.id.toString()}>
              {item.name}
            </PageTab.Title>
          ))
          .concat(
            groupCardList.map((item) => (
              <PageTab.Content key={item.id} tabKey={item.id.toString()}>
                <ShowListCardOfGroup groupId={item.id} />
              </PageTab.Content>
            )),
          )}
      </PageTab>
    </>
  );
};

export default page;
