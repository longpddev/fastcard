import React from "react";
import { useGetListCardQuery } from "../../services/queryApi";
import LoadingIcon from "../../components/LoadingIcon";
import CardDetailItem from "../../components/CardDetailItem";
import { CARD_TYPE } from "../../constants";
import { getMedia } from "../../api/client";
import EditGroupCard from "./EditGroupCard";
import { maybe } from "../../functions/common";
import { path } from "ramda";

const getTitle = (cardStep) =>
  cardStep.length > 0 &&
  cardStep
    .filter((item) => item.type === CARD_TYPE.answer)[0]
    .content.split(" ")
    .slice(0, 10)
    .join(" ");

const getCardType = (cardStep, type) =>
  cardStep.filter((item) => item.type === type);

const getImage = (cardStep) =>
  cardStep.length > 0 &&
  maybe(path([0, "image", "path"], getCardType(cardStep, CARD_TYPE.answer)))
    .map(getMedia)
    .get();

const ShowListCardOfGroup = ({ groupId }) => {
  const { data, isLoading, refetch } = useGetListCardQuery(groupId, {
    refetchOnMountOrArgChange: true,
  });
  return (
    <div>
      <EditGroupCard groupId={groupId} className="mb-4" />
      {isLoading && (
        <div className="text-center">
          <LoadingIcon className="text-4xl" />
        </div>
      )}
      {!isLoading &&
        data.data.rows.map((item) => (
          <CardDetailItem
            key={item.id}
            id={item.id}
            onDeleted={() => refetch()}
            title={
              item.cardStep.length > 0 &&
              item.cardStep
                .filter((item) => item.type === CARD_TYPE.answer)[0]
                .content.split(" ")
                .slice(0, 10)
                .join(" ")
            }
            image={getImage(item.cardStep)}
            createdAt={item.createdAt}
            className="mb-4"
          />
        ))}
    </div>
  );
};

export default ShowListCardOfGroup;
