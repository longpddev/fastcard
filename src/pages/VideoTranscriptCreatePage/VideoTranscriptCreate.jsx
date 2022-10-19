import clsx from "clsx";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { titlePage, watchThunk } from "../../functions/common";
import FieldJson from "./FieldJson";
import FieldVideo from "./FieldVideo";
import Field from "../../components/Field";
import { uploadImageAndGetData } from "../../services/card/cardSlice";
import { linkImageToFile } from "../../helpers/cropimage";
import { createVideoTranscriptThunk } from "../../services/videoTranscript/videoTranscriptSlice";
import { useDispatch } from "react-redux";
import { progressWatchPromise } from "../../components/ProgressGlobal";
import { pushFastToast } from "../../components/Toast";

/**
 * @typedef VideoOb
 * @prop { File } file
 * @prop { number } width
 * @prop { number } height
 */

/**
 * @typedef CreateVideoLearnParams
 * @prop { string } title
 * @prop { string } description
 * @prop { string } thumbnailSrc
 * @prop { string } transcript
 * @prop { VideoOb } videoOb
 */

async function getWidthHeightFileVideo(file) {
  const video = document.createElement("video");

  return await new Promise((res, rej) => {
    video.src = URL.createObjectURL(file);

    video.onloadeddata = function () {
      res({
        file,
        width: video.videoHeight,
        height: video.videoWidth,
      });
    };
  });
}

/**
 * @param {CreateVideoLearnParams} param0
 * @param { (number) => void} onProgress
 */
async function createVideoLearn(
  { title, description, thumbnailSrc, transcript, videoFile },
  dispatch,
  onProgress
) {
  const imageObFile = await linkImageToFile(thumbnailSrc);
  const videoObFile = await getWidthHeightFileVideo(videoFile);
  const imageData = await uploadImageAndGetData(imageObFile);

  return dispatch(
    createVideoTranscriptThunk({
      file: videoObFile.file,
      name: videoObFile.file.name,
      title,
      description,
      thumbnailId: imageData.id,
      width: videoObFile.width,
      height: videoObFile.height,
      transcript,
    })
  );
}

const VideoTranscriptCreate = () => {
  titlePage("upload video");
  const dispatch = useDispatch();
  const [video, videoSet] = useState([]);
  const [title, titleSet] = useState("");
  const [description, descriptionSet] = useState("");
  const [json, jsonSet] = useState("");
  const [thumbnail, thumbnailSet] = useState("");
  const [isPrev, isPrevSet] = useState(false);

  function resetState() {
    videoSet([]);
    titleSet("");
    descriptionSet("");
    jsonSet("");
    thumbnailSet("");
    isPrevSet(false);
  }
  const isValid =
    video.length > 0 &&
    json.length > 0 &&
    thumbnail.length > 0 &&
    title.trim() &&
    description.trim();

  const hasValue = video && video.length > 0;
  const urlDemo = useMemo(
    () => (hasValue ? URL.createObjectURL(video[0]) : ""),
    [video[0]]
  );

  const handleCreate = () => {
    createVideoLearn(
      {
        title: title.trim(),
        description: description.trim(),
        transcript: json,
        thumbnailSrc: thumbnail,
        videoFile: video[0],
      },
      dispatch
    )
      .then(watchThunk)
      .then(() => {
        resetState();
        pushFastToast.success("Create success");
      })
      .catch(() => {
        pushFastToast.error("Create error please try again.");
      })
      .finally(progressWatchPromise());
  };
  return (
    <div>
      <div className="flex flex-wrap mb-6">
        <h1 className="text-2xl">Upload video</h1>
        <button
          onClick={() => isPrevSet(true)}
          className={clsx("button ml-auto cursor-pointer", {
            "disabled:opacity-25 disabled:pointer-events-none": !isValid,
          })}
          disabled={!isValid}
        >
          Preview
        </button>
        <button
          onClick={() => handleCreate()}
          className={clsx("button ml-4 cursor-pointer text-green-400", {
            "disabled:opacity-25 disabled:pointer-events-none": !isValid,
          })}
          disabled={!isValid}
        >
          Save
        </button>
      </div>
      <div className="mb-4">
        <Field
          type="text"
          label="Title*"
          value={title}
          placeholder="Eg: Video title"
          onChange={(v) => titleSet(v)}
        ></Field>
      </div>
      <div className="mb-4">
        <Field
          type="text"
          label="Description*"
          value={description}
          placeholder="Eg: Video description"
          onChange={(v) => descriptionSet(v)}
        ></Field>
      </div>
      {isPrev ? (
        <VideoPlayer
          srcVideo={urlDemo}
          transcript={JSON.parse(json)}
        ></VideoPlayer>
      ) : (
        <>
          <FieldVideo
            value={video}
            valueSet={videoSet}
            thumbnail={thumbnail}
            thumbnailSet={thumbnailSet}
            hasValue={hasValue}
            urlDemo={urlDemo}
          ></FieldVideo>
          <FieldJson value={json} valueSet={jsonSet}></FieldJson>
        </>
      )}
    </div>
  );
};

export default VideoTranscriptCreate;
