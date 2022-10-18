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

const videoTranscriptSlice = createSlice({
  name: "videoTranscript",
  initialState: {},
  reducers: {},
});

export default videoTranscriptSlice.reducer;
