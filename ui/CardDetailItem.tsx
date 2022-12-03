'use client';

import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { watchThunk } from '../functions/common';
import { deleteCardThunk } from '../services/card/cardSlice';
import { pushToast } from '@/ui/Toast/core';
import { progressWatchPromise } from './ProgressGlobal';
const CardDetailItem = ({
  id,
  image,
  title,
  createdAt,
  className,
  onDeleted,
  ...props
}) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteCardThunk({ id }))
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
      <img src={image} alt="" className="h-10 w-10 rounded-md object-cover" />
      <div className="ml-4 flex-1">
        <p>{title}</p>
        <p className="mt-2 text-sm text-slate-400">{createdAt.toString()}</p>
      </div>
      <Link
        to={`/card-detail/${id}`}
        className="button ml-auto flex-none px-3 text-blue-400"
      >
        <i className="fas fa-eye"></i>
      </Link>
      <button
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
