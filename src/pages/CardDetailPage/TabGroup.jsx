import React, { useEffect, useState } from "react";
import ContentTab from "./ContentTab";
import LoadingIcon from "../../components/LoadingIcon";
import { useDispatch } from "react-redux";
import { changeGroupOfCardThunk } from "../../services/card/cardSlice";
import { watchThunk } from "../../functions/common";
import { pushToast } from "../../components/Toast";
import FastCreateOrSelectGroup from "../../components/FastCreateOrSelectGroup";
const TabGroup = ({ cardId, cardData, onSubmit }) => {
  const [selected, selectedSet] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(changeGroupOfCardThunk({ id: cardId, groupId: selected }))
      .then(watchThunk)
      .then(() => {
        pushToast.success("Update success");
        onSubmit && onSubmit();
      })
      .catch(() => {
        pushToast.error("Update error please try again");
      });
  };

  useEffect(() => {
    if (!cardData) return;
    if (selected) return;
    selectedSet(cardData.cardGroupId);
  }, [cardData]);
  return (
    <ContentTab onSubmit={handleSubmit}>
      <FastCreateOrSelectGroup
        value={selected}
        onChange={(e) => selectedSet(e.target.value)}
      />
    </ContentTab>
  );
};

export default TabGroup;
