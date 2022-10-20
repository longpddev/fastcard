import React, { useMemo, useState } from "react";
import VideoTranscriptAction from "./VideoTranscriptAction";
import FieldVideo from "@components/FieldVideo";
import When from "@components/When";
import { getMedia } from "@/api/client";
import VideoViewer from "@components/VideoViewer/VideoViewer";
import MoreFeature from "@components/MoreFeature";
import { useDispatch } from "react-redux";
import { updateVideoTranscriptionSourceThunk } from "@services/videoTranscript/videoTranscriptSlice";
import { getWidthHeightFileVideo } from "@/helpers/cropimage";
import { parseProgress, watchThunk } from "@/functions/common";
import { pushFastToast } from "../../components/Toast/core";
import { progressWatchPromise } from "@components/ProgressGlobal";
import VideoPlayer from "@components/VideoPlayer/VideoPlayer";
import ProgressUpload from "@components/ProgressUpload/ProgressUpload";

const VideoTranscriptEditFieldVideo = ({ data }) => {
  const [uploading, uploadingSet] = useState(null);
  const [isEditMode, isEditModeSet] = useState(false);
  const [isPreviewMode, isPreviewModeSet] = useState(false);
  const dispatch = useDispatch();
  const [video, videoSet] = useState([]);
  const [thumbnail, thumbnailSet] = useState([]);
  const hasValue = video.length > 0;
  const urlDemo = useMemo(
    () => (hasValue ? URL.createObjectURL(video[0]) : ""),
    [hasValue, video[0]]
  );
  const handleReset = () => {
    isEditModeSet(false);
  };
  const handleSave = async () => {
    try {
      const videoFile = await getWidthHeightFileVideo(video[0]);
      await watchThunk(
        await dispatch(
          updateVideoTranscriptionSourceThunk({
            id: data.id,
            ...videoFile,
            onProgressUpload: parseProgress(uploadingSet),
          })
        )
      );
      pushFastToast.success("Save success");
    } catch (e) {
      pushFastToast.error("Save error. Please try again");
    } finally {
      uploadingSet(null);
    }
  };

  if (uploading) {
    return (
      <>
        <h2 className="text-center text-2xl">Uploading</h2>
        <ProgressUpload
          className="mt-6 max-w-[600px] mx-auto"
          loaded={uploading.format.loaded.text}
          total={uploading.format.total.text}
          speed={uploading.format.speed.text}
          processing={uploading.percent}
        />
      </>
    );
  }

  return (
    <div>
      <When if={isEditMode}>
        <When
          if={!isPreviewMode}
          component={FieldVideo}
          value={video}
          valueSet={videoSet}
          thumbnail={thumbnail}
          thumbnailSet={thumbnailSet}
          hasValue={hasValue}
          urlDemo={urlDemo}
        ></When>

        <When if={isPreviewMode}>
          {() => (
            <VideoPlayer
              srcVideo={urlDemo}
              transcript={JSON.parse(data.transcript)}
            />
          )}
        </When>
        <VideoTranscriptAction
          handleReset={handleReset}
          handleSave={handleSave}
          isSaveable={hasValue}
        >
          <When
            component="button"
            if={hasValue}
            onClick={() => isPreviewModeSet(!isPreviewMode)}
            className="button text-sky-400 ml-4 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </When>
        </VideoTranscriptAction>
      </When>
      <When if={!isEditMode}>
        <div className="relative">
          <VideoViewer src={getMedia(data.path)} controls></VideoViewer>
          <MoreFeature className="absolute top-2 right-2">
            <ul>
              <li>
                <button
                  onClick={() => isEditModeSet(true)}
                  className="text-orange-400 whitespace-nowrap px-4 hover:bg-slate-700 py-1"
                >
                  <i className="fas fa-pen mr-2"></i>
                  <span>Change</span>
                </button>
              </li>
            </ul>
          </MoreFeature>
        </div>
      </When>
    </div>
  );
};

export default VideoTranscriptEditFieldVideo;
