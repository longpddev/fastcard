'use client';

import { IReactProps } from '@/interfaces/common';
import {
  deleteGroupCardApi,
  getGroupCardThunk,
  selectorGroupNameExist,
  updateGroupCardAction,
  updateGroupCardApi,
} from '@/services/card/cardSlice';
import IconCircle from '@/ui/IconCircle';
import { progressStart, progressWatchPromise } from '@/ui/ProgressGlobal';
import { pushFastToast } from '@/ui/Toast';
import When from '@/ui/When';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store/app';

const EditGroupCard: IReactProps<{
  groupId: number;
}> = ({ className = '', groupId }) => {
  const [isEdit, isEditSet] = useState(false);
  const [groupName, groupNameSet] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const groupCardDetail = useSelector(
    (s: RootState) => s.card.groupCard.entities,
  )[groupId];
  const groupCardExist = useSelector((s: RootState) =>
    selectorGroupNameExist(s),
  );
  if (!groupCardDetail) return null;
  const handleRemove = () => {
    const isConfirm = confirm(
      "Are you sure for delete this group of cards, all of them would be remove and you can't get it back?",
    );

    if (!isConfirm) return;

    deleteGroupCardApi({ id: groupId })
      .then(() => {
        dispatch(getGroupCardThunk());
        pushFastToast.success('Delete success');
      })
      .catch(() => {
        pushFastToast.error('Delete error please try again');
      })
      .finally(progressWatchPromise());
  };
  const handleEditSet = (status: boolean) => {
    if (status === true) groupNameSet(groupCardDetail.name);
    isEditSet(status);
  };
  const handleChangeGroup = () => {
    if (groupName === groupCardDetail.name) {
      handleEditSet(false);
      return;
    }
    if (groupCardExist(groupName)) {
      pushFastToast.warning('This group of cards are already exist');
      return;
    }

    updateGroupCardApi({ id: groupId, name: groupName })
      .then((response) => {
        dispatch(updateGroupCardAction({ groupId: groupId, name: groupName }));
        pushFastToast.success('Update success');
        handleEditSet(false);
      })
      .catch(() => {
        pushFastToast.error('Update error please try again!');
      })
      .finally(progressWatchPromise());
  };
  return (
    <div className={clsx(className, '')}>
      <div className="flex flex-wrap">
        <div className="mr-4 flex-1 md:mr-6">
          {isEdit ? (
            <input
              type="text"
              className="input p-0 text-2xl"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChangeGroup();
              }}
              value={groupName}
              onChange={(e) => groupNameSet(e.target.value)}
            />
          ) : (
            <h1 className="text-2xl">{groupCardDetail.name}</h1>
          )}
        </div>
        <When if={isEdit}>
          <button onClick={() => handleChangeGroup()}>
            <IconCircle
              wrapClass="icon-circle-shadow text-green-400"
              className="fas fa-check text-sm"
              size="md"
            />
          </button>
        </When>
        <When if={isEdit}>
          <button onClick={() => handleEditSet(false)}>
            <IconCircle
              wrapClass="text-red-400 icon-circle-shadow"
              className="fas fa-xmark text-sm "
              size="md"
            />
          </button>
        </When>
        <When if={!isEdit}>
          <button onClick={() => handleEditSet(!isEdit)}>
            <IconCircle
              wrapClass="icon-circle-shadow text-sky-400"
              className="fas fa-pen text-sm"
              size="md"
            />
          </button>
        </When>
        <When if={!isEdit}>
          <button onClick={handleRemove}>
            <IconCircle
              wrapClass="text-red-400 icon-circle-shadow"
              className="fas fa-trash-can text-sm "
              size="md"
            />
          </button>
        </When>
      </div>
    </div>
  );
};

export default EditGroupCard;
