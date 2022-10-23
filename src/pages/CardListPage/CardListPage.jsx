import { titlePage } from "@/functions/common";
import Breadcrumb from "@components/Breadcrumb";
import HeaderPage from "@components/HeaderPage";
import { path } from "ramda";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PageTab from "../../components/PageTab";
import ShowListCardOfGroup from "./ShowListCardOfGroup";

const CardListPage = () => {
  titlePage("List card");
  const groupCard = useSelector((s) => s.card.groupCard);
  const groupCardList = useMemo(
    () => groupCard.ids.map((id) => groupCard.entities[id]),
    [groupCard]
  );
  return (
    <>
      <Breadcrumb />
      <HeaderPage title="List card"></HeaderPage>
      <PageTab
        key={groupCardList.length}
        defaultActive={path([0, "id"], groupCardList)}
      >
        {groupCardList.map((item) => (
          <PageTab.Title key={item.id} tabKey={item.id}>
            {item.name}
          </PageTab.Title>
        ))}

        {groupCardList.map((item) => (
          <PageTab.Content key={item.id} tabKey={item.id}>
            <ShowListCardOfGroup groupId={item.id} />
          </PageTab.Content>
        ))}
      </PageTab>
    </>
  );
};

export default CardListPage;
