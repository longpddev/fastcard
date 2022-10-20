import clsx from "clsx";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import VideoPlayer from "@components/VideoPlayer";
import { titlePage, watchThunk } from "../../functions/common";
import FieldJson from "@components/FieldJson";
import FieldVideo from "@components/FieldVideo";
import Field from "@components/Field";
import { uploadImageAndGetData } from "@services/card/cardSlice";
import { linkImageToFile } from "../../helpers/cropimage";
import { createVideoTranscriptThunk } from "@services/videoTranscript/videoTranscriptSlice";
import { useDispatch } from "react-redux";
import { progressWatchPromise } from "@components/ProgressGlobal";
import { pushFastToast } from "@components/Toast";
import { getWidthHeightFileVideo } from "@/helpers/cropimage";
import { parseProgress } from "@/functions/common";
import When from "../../components/When";
import ProgressUpload from "@components/ProgressUpload/ProgressUpload";
import HeaderPage from "@components/HeaderPage";

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

/**
 * @param {CreateVideoLearnParams} param0
 * @param { (number) => void} onProgress
 */
async function createVideoLearn(
  { title, description, thumbnailSrc, transcript, videoFile },
  dispatch,
  onProgressUpload
) {
  const [imageObFile, videoObFile] = await Promise.all([
    linkImageToFile(thumbnailSrc),
    getWidthHeightFileVideo(videoFile),
  ]);
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
      onProgressUpload,
    })
  );
}

const VideoTranscriptCreate = () => {
  titlePage("upload video");
  const dispatch = useDispatch();
  const [uploading, uploadingSet] = useState(null);
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
      dispatch,
      parseProgress(uploadingSet)
    )
      .then(watchThunk)
      .then(() => {
        resetState();
        pushFastToast.success("Create success");
      })
      .catch((e) => {
        console.log(e);
        pushFastToast.error("Create error please try again.");
      })
      .finally(() => {
        uploadingSet(null);
      });
  };

  console.log("uploading", uploading);
  return (
    <div>
      <HeaderPage title="Upload video">
        <button
          onClick={() => isPrevSet(!isPrev)}
          className={clsx(
            "button cursor-pointer disabled:opacity-25 disabled:pointer-events-none"
          )}
          disabled={!isValid || uploading}
        >
          {isPrev ? "Edit" : "Preview"}
        </button>
        <button
          onClick={() => handleCreate()}
          className={clsx(
            "button cursor-pointer text-green-400 disabled:opacity-25 disabled:pointer-events-none"
          )}
          disabled={!isValid || uploading}
        >
          Save
        </button>
      </HeaderPage>
      <When if={!uploading}>
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
            <div className="mb-4">
              <FieldVideo
                value={video}
                valueSet={videoSet}
                thumbnail={thumbnail}
                thumbnailSet={thumbnailSet}
                hasValue={hasValue}
                urlDemo={urlDemo}
              ></FieldVideo>
            </div>
            <FieldJson value={json} valueSet={jsonSet}></FieldJson>
          </>
        )}
      </When>
      <When if={uploading}>
        {() => (
          <ProgressUpload
            className="mt-10 max-w-[600px] mx-auto"
            loaded={uploading.format.loaded.text}
            total={uploading.format.total.text}
            speed={uploading.format.speed.text}
            processing={uploading.percent}
          />
        )}
      </When>
    </div>
  );
};

export default VideoTranscriptCreate;
