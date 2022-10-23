import React from "react";
import PageTab from "../../components/PageTab";
import AccountSetting from "./AccountSetting";
import HeaderPage from "@components/HeaderPage";
import { titlePage } from "@/functions/common";
import AccountDetail from "./AccountDetail";
import Breadcrumb from "@components/Breadcrumb";
const ACCOUNT_PAGE = {
  detail: "detail",
  settings: "settings",
};
const AccountPage = () => {
  titlePage("Account detail");
  return (
    <>
      <Breadcrumb />
      <HeaderPage title="Account detail"></HeaderPage>
      <PageTab defaultActive={ACCOUNT_PAGE.detail}>
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

export default AccountPage;
