import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MoreFeature from "@components/MoreFeature";
import { progressWatchPromise } from "@components/ProgressGlobal";
import { pushFastToast, pushToast } from "@components/Toast/core";
import { watchThunk } from "@/functions/common";
import { deleteVideoTranscriptThunk } from "@services/videoTranscript/videoTranscriptSlice";
const VideoTranscriptMoreFeature = ({ id, className = "", requestRefresh }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteVideoTranscriptThunk(id))
      .then(watchThunk)
      .then(() => {
        pushFastToast.success("Delete video transcript success");
        requestRefresh && requestRefresh();
      })
      .catch(() =>
        pushFastToast.error("Delete video transcript error, please try again")
      )
      .finally(progressWatchPromise());
  };
  return (
    <MoreFeature className={clsx(className, "")}>
      <ul>
        <li>
          <ItemFeature
            className="hover:text-sky-400"
            icon={"fa-solid fa-pen-to-square"}
            onClick={() => navigate(`/video/${id}/edit`)}
          >
            Edit
          </ItemFeature>
        </li>
        <li>
          <ItemFeature
            onClick={handleDelete}
            className="hover:text-red-400"
            icon={"fas fa-trash-can"}
          >
            Delete
          </ItemFeature>
        </li>
      </ul>
    </MoreFeature>
  );
};

const ItemFeature = ({ children, icon, className, ...props }) => {
  return (
    <button
      className={clsx(
        "whitespace-nowrap px-4 py-1.5 w-full text-left",
        "before:hover:bg-slate-700 relative before:absolute before:block before:inset-0 before:w-full before:h-full before:z-[-1]",
        className
      )}
      {...props}
    >
      <i className={clsx(icon, "mr-2")}></i>
      <span>{children}</span>
    </button>
  );
};

export default VideoTranscriptMoreFeature;
