'use client';

import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { watchThunk } from '../functions/common';
import { deleteCardThunk } from '../services/card/cardSlice';
import { pushToast } from '@/ui/Toast/core';
import { progressWatchPromise } from './ProgressGlobal';
import { IReactProps } from '@/interfaces/common';
import { ICardStepResponse } from '@/api/fast_card_client_api';
import Link from 'next/link';
import { AppDispatch } from 'store/app';
const CardDetailItem: IReactProps<{
  cardData: ICardStepResponse;
  title: string;
  onDeleted: () => void;
}> = ({ id, cardData, title, className, onDeleted, ...props }) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = () => {
    dispatch(deleteCardThunk({ id: cardData.id }))
      .then(watchThunk)
      .then(() => {
        onDeleted && onDeleted();
        pushToast.success('Delete card success');
      })
      .catch(() => {
        pushToast.error('Delete error please try again!');
      })
      .finally(progressWatchPromise());
  };
  return (
    <div
      className={clsx(
        className,
        'flex items-center rounded-sm bg-slate-700 p-3 shadow-md shadow-slate-900',
      )}
      {...props}
    >
      <img
        src={cardData.image.path}
        alt=""
        className="h-10 w-10 rounded-md object-cover"
      />
      <div className="ml-4 flex-1">
        <p>{title}</p>
        <p className="mt-2 text-sm text-slate-400">
          {cardData.createdAt.toString()}
        </p>
      </div>
      <Link
        href={`/card-detail/${cardData.id}`}
        className="button ml-auto flex-none px-3 text-blue-400"
      >
        <i className="fas fa-eye"></i>
      </Link>
      <button
        title="delete card"
        onClick={() => {
          if (confirm('Are you sure for delete this Card hard work for create'))
            handleDelete();
        }}
        className="button ml-3 flex-none px-3 text-red-400"
      >
        <i className="fas fa-trash-can"></i>
      </button>
    </div>
  );
};

export default CardDetailItem;
