import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { clientAuth, uploadfile } from "../../api/client";
import { CARD_TYPE } from "../../constants";
import { run } from "../../functions/common";

export const createCardThunk = createAsyncThunk(
  "card/createCard",
  async ({ groupId, question, answer, explain }) => {
    const [questionImage, answerImage, explainImage] = await Promise.all(
      run(() => {
        const result = [
          uploadImageAndGetData(question.fileImage),
          uploadImageAndGetData(answer.fileImage),
        ];
        explain && result.push(uploadImageAndGetData(explain.fileImage));
        return result;
      })
    );

    const result = await clientAuth.POST(
      explain ? "/card" : "/card/noexplain",
      {
        body: run(() => {
          const result = {
            info: {
              cardGroupId: groupId,
            },
            cardQuestion: {
              imageId: questionImage ? questionImage.id : null,
              content: question.detail,
              type: CARD_TYPE.question,
              cardGroupId: groupId,
            },
            cardAnswer: {
              imageId: answerImage ? answerImage.id : null,
              content: answer.detail,
              type: CARD_TYPE.answer,
              cardGroupId: groupId,
            },
          };

          explain &&
            (result.cardExplain = {
              imageId: explainImage ? explainImage.id : null,
              content: explain.detail,
              type: CARD_TYPE.explain,
              cardGroupId: groupId,
            });

          return result;
        }),
      }
    );
    return result;
  }
);

export const uploadImageAndGetData = async (file) => {
  if (!file) return file;
  const result = await uploadfile("/image/upload", file);
  return result.data;
};

export const updateImageAndGetData = async (id, file) => {
  const result = await uploadfile(`/image/${id}`, file);
  return result.data;
};

export const deleteCardThunk = createAsyncThunk(
  "card/deleteCard",
  async ({ id }) => {
    return await clientAuth.DELETE(`/card/${id}`);
  }
);

export const createGroupCardThunk = createAsyncThunk(
  "card/createGroupCard",
  async ({ name }, { dispatch }) => {
    const result = await clientAuth.POST("/group-card", {
      body: {
        name: name,
      },
    });

    await dispatch(getGroupCardThunk());
    await dispatch(getCardLearnTodayThunk());

    return result;
  }
);

export const changeGroupOfCardThunk = createAsyncThunk(
  "card/changeGroupOfCard",
  async ({ id, groupId }) => {
    return await clientAuth.PUT(`/card/${id}/changeGroup`, {
      body: { groupId },
    });
  }
);

export const updateGroupCardThunk = createAsyncThunk(
  "card/updateGroupCard",
  async ({ id, name }) => {
    await clientAuth.PUT(`/group-card/${id}`, {
      body: {
        name: name,
      },
    });

    return {
      id,
      name,
    };
  }
);

export const deleteGroupCardThunk = createAsyncThunk(
  "card/deleteGroupCard",
  async ({ id }, { dispatch }) => {
    await clientAuth.DELETE(`/group-card/${id}`);
    await dispatch(getGroupCardThunk());
    return { id };
  }
);

export const updateCardStepThunk = createAsyncThunk(
  "card/updateCardStep",
  async ({ id, data }) => {
    return await clientAuth.PUT(`/card/step/${id}`, { body: data });
  }
);

export const getCardLearnTodayThunk = createAsyncThunk(
  "card/getCardLearnToday",
  async (_, { getState }) => {
    const groupCardIds = getState().card.groupCard.ids;
    const settings = getState().auth.settings;
    if (groupCardIds.length === 0)
      throw new Error("Group card doesn't load yet ");
    if (Object.keys(settings).length === 0)
      throw new Error("Setting user doesn't load yet");
    const result = await Promise.all(
      groupCardIds.map(async (groupId) => {
        const card = await clientAuth.GET("/card/learn-today", {
          params: {
            limit: settings.maxCardInDay,
            groupId,
          },
        });

        return {
          groupId,
          card: {
            rows: card.data.rows,
            count: card.data.count,
          },
        };
      })
    );
    return result;
  }
);

export const getGroupCardThunk = createAsyncThunk(
  "card/getGroupCard",
  async () => {
    return (await clientAuth.GET("/group-card")).data;
  }
);

export const updateCardLearnedThunk = createAsyncThunk(
  "card/updateCardLearned",
  async ({ cardId, isHard, groupId }) => {
    await clientAuth.POST("/card/learned", {
      body: {
        cardId,
        isHard,
      },
    });
    return {
      cardId,
      groupId,
    };
  }
);

export const cardSlice = createSlice({
  name: "card",
  initialState: {
    process: {},
    learnToday: {
      ids: [],
      entities: {},
    },
    groupCard: {
      count: 0,
      ids: [],
      entities: {},
    },
  },
  reducers: {
    initProcess: (state, { payload }) => {
      state.process[payload.groupId] = 0;
    },
    nextProcess: (state, { payload }) => {
      const max =
        state.learnToday.entities[payload.groupId].card.rows.length - 1;
      state.process[payload.groupId] += 1;

      state.process[payload.groupId] = Math.min(
        Math.max(max, 0),
        state.process[payload.groupId]
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGroupCardThunk.fulfilled, (state, { payload }) => {
        state.groupCard.count = payload.count;
        state.groupCard.ids = payload.rows.map((item) => item.id);
        state.groupCard.entities = payload.rows.reduce(
          (acc, item) => (acc[item.id] = item) && acc,
          {}
        );
      })
      .addCase(getCardLearnTodayThunk.fulfilled, (state, { payload }) => {
        state.learnToday.ids = payload.map((item) => item.groupId);
        state.learnToday.entities = payload.reduce(
          (acc, item) => (acc[item.groupId] = item) && acc,
          {}
        );
      })
      .addCase(updateGroupCardThunk.fulfilled, (state, { payload }) => {
        const { id, name } = payload;
        if (state.groupCard.entities[id]) {
          state.groupCard.entities[id].name = name;
        }
      })
      .addCase(updateCardLearnedThunk.fulfilled, (state, { payload }) => {
        const card = state.learnToday.entities[payload.groupId].card;

        card.rows = card.rows.filter((item) => item.id !== payload.cardId);

        state.process[payload.groupId] = Math.min(
          Math.max(card.rows.length - 1, 0),
          state.process[payload.groupId]
        );
      });
  },
});

export const selectorGroupNameExist = createSelector(
  (state) => state.card.groupCard.entities,
  (entities) => (groupName) =>
    Object.values(entities).some(
      (group) => group.name.toLowerCase() === groupName.toLowerCase()
    )
);
export default cardSlice.reducer;
export const { initProcess, nextProcess } = cardSlice.actions;
