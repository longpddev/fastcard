'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientAuth } from '../../api/client';
import { watchThunk } from '@/functions/common';
import {
  createGroupCardThunk,
  selectorGroupNameExist,
} from '../../services/card/cardSlice';
import { progressDone, progressStart } from '../ProgressGlobal/ProgressGlobal';
import { pushToast } from '../Toast/core';
const FastAdd = ({ onClose, ...props }) => {
  const inputRef = useRef();
  const [value, valueSet] = useState('');
  const checkGroupNameExist = useSelector(selectorGroupNameExist);

  const dispatch = useDispatch();
  const handleAdd = () => {
    const val = value.trim();
    if (val.length === 0) {
      shake();
      pushToast.warning('Please fill name of group');
      return;
    }

    if (checkGroupNameExist(value)) {
      shake();
      pushToast.warning('The group card already exist, Please try again!');
      return;
    }
    progressStart();
    dispatch(createGroupCardThunk({ name: value }))
      .then(watchThunk)
      .then(() => {
        pushToast.success('Create success');
        valueSet('');
        onClose && onClose();
      })
      .catch((e) => {
        pushToast.error('Create error please try again');
      })
      .finally(progressDone);
  };
  const shake = () => {
    inputRef.current.classList.add('shake-animate');
  };

  useEffect(() => {
    const element = inputRef.current;
    const handle = (e) => {
      element.classList.remove('shake-animate');
    };
    element.addEventListener('animationend', handle);

    return () => {
      element.removeEventListener('animationend', handle);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
    if (e.key === 'Esc') {
      valueSet('');
      onClose && onClose();
    }
  };
  return (
    <div className="mt-4 flex" {...props}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => valueSet(e.target.value)}
        placeholder="Name of Group: e.g. Lean something"
        className="input relative left-0 right-0 transition-all"
      />
      <button
        onClick={handleAdd}
        className="button ml-2 text-sm text-green-400"
      >
        Add
      </button>
    </div>
  );
};

export default FastAdd;
