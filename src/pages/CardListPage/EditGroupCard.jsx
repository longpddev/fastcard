import clsx from "clsx";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconCircle from "../../components/IconCircle";
import When from "../../components/When";
import {
  deleteGroupCardThunk,
  selectorGroupNameExist,
  updateGroupCardThunk,
} from "../../services/card/cardSlice";
import { progressDone, progressStart } from "../../components/ProgressGlobal";
import { watchThunk } from "../../functions/common";
import { pushFastToast } from "../../components/Toast/core";
const EditGroupCard = ({ className = "", groupId }) => {
  const [isEdit, isEditSet] = useState(false);
  const [groupName, groupNameSet] = useState("");
  const dispatch = useDispatch();
  const groupCardDetail = useSelector((s) => s.card.groupCard.entities)[
    groupId
  ];
  const groupCardExist = useSelector((s) => selectorGroupNameExist(s));
  if (!groupCardDetail) return null;
  const handleRemove = () => {
    const isConfirm = confirm(
      "Are you sure for delete this group of cards, all of them would be remove and you can't get it back?"
    );

    if (!isConfirm) return;
    progressStart();
    dispatch(deleteGroupCardThunk({ id: groupId }))
      .then(watchThunk)
      .then(() => {
        pushFastToast.success("Delete success");
      })
      .catch(() => {
        pushFastToast.error("Delete error please try again");
      })
      .finally(() => progressDone());
  };
  const handleEditSet = (status) => {
    if (status === true) groupNameSet(groupCardDetail.name);
    isEditSet(status);
  };
  const handleChangeGroup = () => {
    if (groupName === groupCardDetail.name) {
      handleEditSet(false);
      return;
    }
    if (groupCardExist(groupName)) {
      pushFastToast.warning("This group of cards are already exist");
      return;
    }
    progressStart();
    dispatch(updateGroupCardThunk({ id: groupId, name: groupName }))
      .then(watchThunk)
      .then(() => {
        pushFastToast.success("Update success");
        handleEditSet(false);
      })
      .catch(() => {
        pushFastToast.error("Update error please try again!");
      })
      .finally(() => {
        progressDone();
      });
  };
  return (
    <div className={clsx(className, "")}>
      <div className="flex flex-wrap">
        <div className="flex-1 md:mr-6 mr-4">
          {isEdit ? (
            <input
              type="text"
              className="text-2xl p-0 input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleChangeGroup();
              }}
              value={groupName}
              onChange={(e) => groupNameSet(e.target.value)}
            />
          ) : (
            <h1 className="text-2xl">{groupCardDetail.name}</h1>
          )}
        </div>
        <When
          component="button"
          if={isEdit}
          className="mr-3"
          onClick={() => handleChangeGroup()}
        >
          <IconCircle
            wrapClass="icon-circle-shadow text-green-400"
            className="fas fa-check text-sm"
            size="md"
          />
        </When>
        <When
          component="button"
          if={isEdit}
          className=""
          onClick={() => handleEditSet(false)}
        >
          <IconCircle
            wrapClass="text-red-400 icon-circle-shadow"
            className="fas fa-xmark text-sm "
            size="md"
          />
        </When>
        <When
          component="button"
          if={!isEdit}
          className="mr-3"
          onClick={() => handleEditSet(!isEdit)}
        >
          <IconCircle
            wrapClass="icon-circle-shadow text-sky-400"
            className="fas fa-pen text-sm"
            size="md"
          />
        </When>
        <When
          component="button"
          if={!isEdit}
          className=""
          onClick={handleRemove}
        >
          <IconCircle
            wrapClass="text-red-400 icon-circle-shadow"
            className="fas fa-trash-can text-sm "
            size="md"
          />
        </When>
      </div>
    </div>
  );
};

export default EditGroupCard;
