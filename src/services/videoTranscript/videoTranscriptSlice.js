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
  }) => {
    return await uploadfile("/video/upload", {
      file,
      name,
      title,
      description,
      thumbnailId,
      width,
      height,
      metadata: JSON.stringify(metadata),
      transcript,
    });
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
