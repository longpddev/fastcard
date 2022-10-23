import { getVideoTranscriptByIdThunk } from "@services/videoTranscript/videoTranscriptSlice";
import React from "react";
import { useThunk } from "../../hooks/useThunk";
import { useParams } from "react-router-dom";
import VideoTranscriptEditField from "./VideoTranscriptEditField";
import When from "../../components/When";
import PageTab from "@components/PageTab/index";
import VideoTranscriptEditFieldVideo from "./VideoTranscriptEditFieldVideo";
import { titlePage } from "@/functions/common";
import HeaderPage from "@components/HeaderPage";
import Breadcrumb from "@components/Breadcrumb";
import { VIDEO_LIST_PAGE } from "../constant";

const VideoTranscriptEdit = () => {
  titlePage("Edit video");
  const { videoId } = useParams();
  const { data, reload } = useThunk(getVideoTranscriptByIdThunk, videoId);
  return (
    <div>
      <Breadcrumb paths={[VIDEO_LIST_PAGE]} />
      <HeaderPage title="Edit video" />
      <PageTab defaultActive="content">
        <PageTab.Title tabKey={"content"}>Content</PageTab.Title>
        <PageTab.Title tabKey={"video"}>Video</PageTab.Title>
        <PageTab.Content tabKey={"content"}>
          <When if={data}>
            <VideoTranscriptEditField
              data={data}
              onSaveDone={reload}
            ></VideoTranscriptEditField>
          </When>
        </PageTab.Content>
        <PageTab.Content tabKey={"video"}>
          <When if={data}>
            <VideoTranscriptEditFieldVideo
              data={data}
              onSaveDone={reload}
            ></VideoTranscriptEditFieldVideo>
          </When>
        </PageTab.Content>
      </PageTab>
    </div>
  );
};

export default VideoTranscriptEdit;
