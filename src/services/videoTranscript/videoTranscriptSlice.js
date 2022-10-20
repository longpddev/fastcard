import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clientAuth, uploadfile } from "../../api/client";
export const createVideoTranscriptThunk = createAsyncThunk(
  "videoTranscript/createVideoTranscriptThunk",
  async ({
    file,
    name,
    title,
    description,
    thumbnailId,
    width,
    height,
    metadata = {},
    transcript,
    onProgressUpload,
  }) => {
    return await uploadfile(
      "/video/upload",
      {
        file,
        name,
        title,
        description,
        thumbnailId,
        width,
        height,
        metadata: JSON.stringify(metadata),
        transcript,
      },
      "POST",
      { onProgressUpload }
    );
  }
);

export const getVideoTranscriptByIdThunk = createAsyncThunk(
  "videoTranscript/getVideoTranscriptById",
  async (id) => {
    const result = await clientAuth.GET(`/video/${id}`);

    return result.data;
  }
);

export const updateVideoDataThunk = createAsyncThunk(
  "videoTranscript/updateVideoData",
  async ({ field, id }) => {
    const result = await clientAuth.PUT(`/video/${id}`, {
      body: JSON.stringify(field),
    });

    return result.data;
  }
);

export const updateVideoTranscriptionSourceThunk = createAsyncThunk(
  "videoTranscript/updateVideoTranscriptionSource",
  async ({ id, file, width, height, onProgressUpload }) => {
    return await uploadfile(
      `/video/${id}/change-video`,
      {
        file,
        width,
        height,
      },
      "PUT",
      {
        onProgressUpload,
      }
    );
  }
);

export const deleteVideoTranscriptThunk = createAsyncThunk(
  "videoTranscript/deleteVideoTranscript",
  async (id) => {
    return await clientAuth.DELETE(`/video/${id}`);
  }
);

const videoTranscriptSlice = createSlice({
  name: "videoTranscript",
  initialState: {
    metadata: {
      processIndex: undefined,
    },
  },
  reducers: {
    setCurrentProcess: (state, { payload }) => {
      state.metadata.processIndex = payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getVideoTranscriptByIdThunk.fulfilled, (state, payload) => {
      state.metadata.processIndex = payload.metadata?.processIndex || 0;
    }),
});

export default videoTranscriptSlice.reducer;

export const { setCurrentProcess } = videoTranscriptSlice.actions;
