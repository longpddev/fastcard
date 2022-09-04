import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { watchThunk } from "../functions/common";
import { deleteCardThunk } from "../services/card/cardSlice";
import { pushToast } from "../components/Toast/core";
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
        pushToast.success("Delete card success");
      })
      .catch(() => {
        pushToast.error("Delete error please try again!");
      });
  };
  return (
    <div
      className={clsx(
        className,
        "shadow-md shadow-slate-900 bg-slate-700 p-3 flex items-center rounded-sm"
      )}
      {...props}
    >
      <img src={image} alt="" className="rounded-md object-cover w-10 h-10" />
      <div className="ml-4">
        <p>{title}</p>
        <p className="text-slate-400 text-sm mt-2">{createdAt.toString()}</p>
      </div>
      <Link
        to={`/card-detail/${id}`}
        className="button text-blue-400 px-4 ml-auto"
      >
        <i className="fas fa-eye"></i>
      </Link>
      <button
        onClick={() => {
          if (confirm("Are you sure for delete this Card hard work for create"))
            handleDelete();
        }}
        className="button text-red-400 ml-3 px-4"
      >
        <i className="fas fa-trash-can"></i>
      </button>
    </div>
  );
};

export default CardDetailItem;
