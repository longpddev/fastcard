import { sliceFile } from "@/functions/common";
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
    let result = "";
    const sliceFiles = sliceFile(file);
    const progress = sliceFiles.map((f) => ({ loaded: 0, total: f.size }));
    let prevTime = new Date().getTime();
    const handleProgressUpload = () => {
      if (!onProgressUpload) return;
      const currentTime = new Date().getTime();
      if (currentTime <= prevTime + 1000) {
        return;
      }
      prevTime = currentTime;

      onProgressUpload(
        progress.reduce((acc, i) => (acc += i.loaded), 0),
        progress.reduce((acc, i) => (acc += i.total), 0)
      );
    };
    const {
      data: { tokenUpload },
    } = await clientAuth.GET("/video/upload-multiple/init");
    result = await Promise.all(
      sliceFiles.map((f, index) =>
        uploadfile(
          "/video/upload-multiple/file",
          {
            file: f,
            index,
            size: f.size,
            totalFile: sliceFiles.length,
            tokenUpload,
          },
          "POST",
          {
            onProgressUpload: function (loaded, total) {
              progress[index].loaded = loaded;
              progress[index].total = total;
              handleProgressUpload();
            },
          }
        )
      )
    );

    result = await clientAuth.POST("/video/upload-multiple/merge", {
      body: {
        tokenUpload,
      },
    });
    result = await clientAuth.POST("/video/upload", {
      body: {
        data: {
          title,
          name,
          description,
          thumbnailId,
          width,
          height,
          metadata: JSON.stringify(metadata),
          transcript,
        },
        tokenUpload,
        extension: "mp4",
      },
    });
    return result;
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
    builder.addCase(
      getVideoTranscriptByIdThunk.fulfilled,
      (state, { payload }) => {
        state.metadata.processIndex = payload.metadata?.processIndex || 0;
      }
    ),
});

export default videoTranscriptSlice.reducer;

export const { setCurrentProcess } = videoTranscriptSlice.actions;
