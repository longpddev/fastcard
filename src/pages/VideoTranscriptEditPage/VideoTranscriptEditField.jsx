import Field from "@components/Field/Field";
import React, { useEffect, useState } from "react";
import FieldJson from "@components/FieldJson";
import { useDispatch } from "react-redux";
import { updateVideoDataThunk } from "@services/videoTranscript/videoTranscriptSlice";
import { watchThunk } from "@/functions/common";
import { progressWatchPromise } from "@components/ProgressGlobal";
import { pushFastToast } from "@components/Toast/core";
import VideoTranscriptAction from "./VideoTranscriptAction";

const VideoTranscriptEditField = ({ data, onSaveDone }) => {
  const dispatch = useDispatch();
  const [title, titleSet] = useState("");
  const [description, descriptionSet] = useState("");
  const [json, jsonSet] = useState("");
  const isDiff =
    data.title !== title ||
    data.description !== description ||
    data.transcript !== json;
  const handleReset = () => {
    titleSet(data.title);
    descriptionSet(data.description);
    jsonSet(data.transcript);
  };
  const handleSave = () => {
    const field = {};

    if (data.title !== title) {
      field.title = title;
    }

    if (data.description !== description) {
      field.description = description;
    }

    if (data.transcript !== json) {
      field.transcript = json;
    }
    dispatch(updateVideoDataThunk({ id: data.id, field }))
      .then(watchThunk)
      .then(() => {
        pushFastToast.success("Save success");
        onSaveDone && onSaveDone();
      })
      .catch(() => {
        pushFastToast.error("Save fail please try again");
      })
      .finally(progressWatchPromise());
  };

  useEffect(() => {
    handleReset();
  }, [data.title, data.description, data.transcript]);
  return (
    <div>
      <div className="mb-4">
        <Field
          type="text"
          label="Title *"
          value={title}
          onChange={(v) => titleSet(v)}
        ></Field>
      </div>
      <div className="mb-4">
        <Field
          type="text"
          value={description}
          label="Description *"
          onChange={(v) => descriptionSet(v)}
        ></Field>
      </div>
      <div>
        <FieldJson value={json} valueSet={jsonSet}></FieldJson>
      </div>
      <VideoTranscriptAction
        handleReset={handleReset}
        handleSave={handleSave}
        isSaveable={isDiff}
      />
    </div>
  );
};

export default VideoTranscriptEditField;
