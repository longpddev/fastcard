import React from 'react';
import Header from '@/ui/Header';
import Footer from '@/ui/Footer';
import InitDataInPage from './initDataInPage';
import updateCookie from '@/api/updateCookie';
import {
  getCardLearnTodayByGroupIdApi,
  getGroupCardApi,
  setCardLearnTodayByGroupIdAction,
  setGroupCard,
} from '@/services/card/cardSlice';
import { getUserInfoApi, setUserInfoAction } from '@/services/auth/authSlice';
import { store } from 'store/app';

async function Layout({ children }: { children: React.ReactNode }) {
  updateCookie();
  const userInfo = await getUserInfoApi();
  const groupCard = await getGroupCardApi();
  const cardLearnTodays = await Promise.all(
    groupCard.rows.map((item) =>
      getCardLearnTodayByGroupIdApi({
        groupId: item.id,
        settings: userInfo.user.settings,
      }),
    ),
  );

  return (
    <InitDataInPage value={{ userInfo, groupCard, cardLearnTodays }}>
      <Header />
      <main className="c-container relative pb-10">{children}</main>
      <Footer></Footer>
    </InitDataInPage>
  );
}

export default Layout;
