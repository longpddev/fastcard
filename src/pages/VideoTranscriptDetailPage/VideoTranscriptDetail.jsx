import React from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { useParams } from "react-router-dom";
import { getMedia } from "../../api/client";
import { useThunk } from "../../hooks/useThunk";
import {
  getVideoTranscriptByIdThunk,
  setCurrentProcess,
  updateVideoDataThunk,
} from "../../services/videoTranscript/videoTranscriptSlice";
import { useEffect } from "react";
import { store } from "../../store/app";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import HeaderPage from "@components/HeaderPage";
import { titlePage } from "@/functions/common";
import Breadcrumb from "@components/Breadcrumb";
import { VIDEO_LIST_PAGE } from "@pages/constant";
function useAutoSaveProgress(id) {
  const dispatch = useDispatch();
  return useCallback((newProcess) => {
    console.log(store.getState());
    const selectorMetadata = () => store.getState().videoTranscript.metadata;
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
      <HeaderPage title="Learn with video" />
      {videoData && (
        <VideoPlayer
          srcVideo={getMedia(videoData.path)}
          transcript={JSON.parse(videoData.transcript)}
          startBy={videoData.metadata?.processIndex}
          onSegmentChange={(segment) => autoSave(segment.timeStart)}
        ></VideoPlayer>
      )}
    </div>
  );
};

export default VideoTranscriptDetail;
