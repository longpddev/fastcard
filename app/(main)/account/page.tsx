'use client';

import Breadcrumb from '@/ui/Breadcrumb';
import HeaderPage from '@/ui/HeaderPage';
import AccountDetail from '@/ui/Page/AccountDetail';
import AccountSetting from '@/ui/Page/AccountSetting';
import PageTab from '@/ui/PageTab';
import React from 'react';

const ACCOUNT_PAGE = {
  detail: 'detail',
  settings: 'settings',
};

const page = () => {
  return (
    <>
      <Breadcrumb />
      <HeaderPage title="Account detail"></HeaderPage>
      <PageTab
        typeStep={false}
        onSubmit={() => {}}
        defaultActive={ACCOUNT_PAGE.detail}
      >
        <PageTab.Title tabKey={ACCOUNT_PAGE.detail}> Detail </PageTab.Title>
        <PageTab.Title tabKey={ACCOUNT_PAGE.settings}> Settings </PageTab.Title>

        <PageTab.Content tabKey={ACCOUNT_PAGE.detail}>
          <AccountDetail />
        </PageTab.Content>
        <PageTab.Content tabKey={ACCOUNT_PAGE.settings}>
          <AccountSetting />
        </PageTab.Content>
      </PageTab>
    </>
  );
};

export default page;
