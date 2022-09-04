import React from "react";
import PageTab from "../../components/PageTab";
import AccountSetting from "./AccountSetting";
const ACCOUNT_PAGE = {
  detail: "detail",
  settings: "settings",
};
const AccountPage = () => {
  return (
    <PageTab defaultActive={ACCOUNT_PAGE.detail}>
      <PageTab.Title tabKey={ACCOUNT_PAGE.detail}> Detail </PageTab.Title>
      <PageTab.Title tabKey={ACCOUNT_PAGE.settings}> Settings </PageTab.Title>

      <PageTab.Content tabKey={ACCOUNT_PAGE.detail}>content</PageTab.Content>
      <PageTab.Content tabKey={ACCOUNT_PAGE.settings}>
        <AccountSetting />
      </PageTab.Content>
    </PageTab>
  );
};

export default AccountPage;
