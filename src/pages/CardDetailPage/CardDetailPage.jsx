import React from "react";
import { useParams } from "react-router-dom";
import PageTab from "../../components/PageTab";
import { useGetCardDetailQuery } from "../../services/queryApi";
import { TabCardAnswer, TabCardExplain, TabCardQuestion } from "./TabCardInfo";
import TabGroup from "./TabGroup";
import { always, curry, ifElse, isEmpty, isNil, path } from "ramda";
import { CARD_TYPE } from "../../constants";
const PAGE_TAB = {
  card_group: "card_group",
  question: "question",
  answer: "answer",
  explain: "explain",
};

const keyBy = curry((key, data) =>
  data.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {})
);

const CardDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetCardDetailQuery(id);

  const cardStepOb = ifElse(
    isNil,
    always({}),
    keyBy("type")
  )(path(["data", "cardStep"])(data));
  console.log(isLoading);
  const cardExist = (type) => Boolean(cardStepOb[type]);
  const handleSubmit = () => refetch();
  return (
    <PageTab defaultActive={PAGE_TAB.card_group}>
      <PageTab.Title tabKey={PAGE_TAB.card_group}>Select Group</PageTab.Title>
      <PageTab.Title tabKey={PAGE_TAB.question}>Question</PageTab.Title>
      <PageTab.Title tabKey={PAGE_TAB.answer}>Answer</PageTab.Title>
      {cardExist(PAGE_TAB.explain) && (
        <PageTab.Title tabKey={PAGE_TAB.explain}>Explain</PageTab.Title>
      )}

      <PageTab.Content tabKey={PAGE_TAB.card_group}>
        <TabGroup
          cardId={id}
          cardData={path(["data"])(data)}
          onSubmit={() => handleSubmit()}
        />
      </PageTab.Content>
      <PageTab.Content tabKey={PAGE_TAB.question}>
        <TabCardQuestion
          cardId={id}
          isLoading={isLoading}
          cardData={cardStepOb[CARD_TYPE.question]}
          onSubmit={() => handleSubmit()}
        />
      </PageTab.Content>
      <PageTab.Content tabKey={PAGE_TAB.answer}>
        <TabCardAnswer
          cardId={id}
          isLoading={isLoading}
          cardData={cardStepOb[CARD_TYPE.answer]}
          onSubmit={() => handleSubmit()}
        />
      </PageTab.Content>
      {cardExist(PAGE_TAB.explain) && (
        <PageTab.Content tabKey={PAGE_TAB.explain}>
          <TabCardExplain
            cardId={id}
            isLoading={isLoading}
            cardData={cardStepOb[CARD_TYPE.explain]}
            onSubmit={() => handleSubmit()}
          />
        </PageTab.Content>
      )}
    </PageTab>
  );
};

export default CardDetailPage;
