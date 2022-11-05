import React from "react";
import VideoPlayer from "@components/VideoPlayer";
import { useParams } from "react-router-dom";
import { getMedia } from "@/api/client";
import { useThunk } from "@hooks/useThunk";
import {
  getVideoTranscriptByIdThunk,
  setCurrentProcess,
  updateVideoDataThunk,
} from "@services/videoTranscript/videoTranscriptSlice";
import { useEffect } from "react";
import { store } from "@/store/app";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import HeaderPage from "@components/HeaderPage";
import { titlePage } from "@/functions/common";
import Breadcrumb from "@components/Breadcrumb";
import { VIDEO_LIST_PAGE } from "@pages/constant";
function useAutoSaveProgress(id) {
  const dispatch = useDispatch();
  return useCallback((newProcess) => {
    const selectorMetadata = () => store.getState().videoTranscript.metadata;
    console.log([selectorMetadata().processIndex, newProcess]);
    if (selectorMetadata().processIndex !== newProcess) {
      dispatch(setCurrentProcess(newProcess));
      dispatch(
        updateVideoDataThunk({ id, field: { metadata: selectorMetadata() } })
      );
    }
  });
}

const VideoTranscriptDetail = () => {
  titlePage("Learn with video");
  const { videoId } = useParams();
  const { data } = useThunk(getVideoTranscriptByIdThunk, videoId);
  const autoSave = useAutoSaveProgress(videoId);
  const videoData = data;

  return (
    <div>
      <Breadcrumb paths={[VIDEO_LIST_PAGE]} />
      <HeaderPage title={videoData?.title || "Learn with video"} />
      {videoData ? (
        <VideoPlayer
          srcVideo={getMedia(videoData.path)}
          width={videoData.width}
          height={videoData.height}
          transcript={JSON.parse(videoData.transcript)}
          startBy={videoData.metadata?.processIndex}
          onSegmentChange={(segment) => autoSave(segment.timeStart)}
        />
      ) : (
        <div
          className="w-full"
          style={{ paddingTop: "calc((100% - 350px) * 0.5625)" }}
        ></div>
      )}
    </div>
  );
};

export default VideoTranscriptDetail;
