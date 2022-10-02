import React, { useState } from "react";
import FileUpLoad from "../../components/FileUpLoad";
import { CARD_TYPE } from "../../constants";
import ContentTab from "./ContentTab";
import LoadingIcon from "../../components/LoadingIcon";
import { getMedia } from "../../api/client";
import EditorMarkdown from "../../components/EditorMarkdown";
import { useDispatch } from "react-redux";
import {
  updateCardStepThunk,
  updateImageAndGetData,
  uploadImageAndGetData,
} from "../../services/card/cardSlice";
import {
  getFileImageField,
  pickKey,
  run,
  watchThunk,
} from "../../functions/common";
import { pushToast } from "../../components/Toast";

const creatorComponent =
  (cardType) =>
  ({ cardId, cardData, onSubmit }) => {
    const [isEditImage, isEditImageSet] = useState(false);
    const [croppedImage, setCroppedImage] = useState();
    const [content, setContent] = useState(cardData.content);
    const [imageUrl, imageUrlSet] = useState();
    const dispatch = useDispatch();
    const handleSubmit = async () => {
      let imageId = cardData.imageId;
      if (croppedImage) {
        if (imageId) {
          const data = await updateImageAndGetData(
            imageId,
            getFileImageField(croppedImage)
          );
        } else {
          const result = await uploadImageAndGetData(
            getFileImageField(croppedImage)
          );
          imageId = result.id;
        }
      }
      let result = await dispatch(
        updateCardStepThunk({
          id: cardData.id,
          data: pickKey(
            ["content", "imageId", "times", "type", "cardId", "cardGroupId"],
            {
              ...cardData,
              imageId,
              content,
            }
          ),
        })
      );
      try {
        result = await watchThunk(result);
        onSubmit && onSubmit();
        pushToast.success("Update success");
      } catch (e) {
        pushToast.error("Update error please try again!");
      }
    };

    return (
      <ContentTab onSubmit={handleSubmit}>
        {cardData.image && !isEditImage ? (
          <div className="flex">
            <div className="mx-auto relative">
              <img
                src={getMedia(cardData.image.path)}
                alt=""
                className="max-w-[400px]"
              />
              <div className="absolute top-0 right-0 flex">
                <button
                  onClick={() => {
                    imageUrlSet(getMedia(cardData.image.path));
                    isEditImageSet(true);
                  }}
                  className=" text-slate-500 hover:text-sky-400 text-md w-8 h-8 inline-flex items-center justify-center"
                >
                  <i className="fas fa-pen "></i>
                </button>
                <button
                  onClick={() => {
                    isEditImageSet(true);
                  }}
                  className=" text-slate-500 hover:text-red-400 text-2xl w-8 h-8 inline-flex items-center justify-center"
                >
                  <i className="fas fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <FileUpLoad
            croppedImage={croppedImage}
            setCroppedImage={setCroppedImage}
            setImageUrl={() => {
              imageUrlSet(undefined);
              isEditImageSet(false);
            }}
            imageUrl={imageUrl}
          />
        )}

        <EditorMarkdown
          className="mt-4"
          value={content}
          onChange={(value) => setContent(value)}
        />
      </ContentTab>
    );
  };

export const TabCardQuestion = run(() => {
  const Component = creatorComponent(CARD_TYPE.question);

  return ({ isLoading, ...props }) => {
    return (
      <>
        {isLoading ? (
          <div className="text-center">
            <LoadingIcon className="text-4xl" />
          </div>
        ) : (
          <Component {...props} />
        )}
      </>
    );
  };
});
export const TabCardAnswer = run(() => {
  const Component = creatorComponent(CARD_TYPE.answer);

  return ({ isLoading, ...props }) => {
    return (
      <>
        {isLoading ? (
          <div className="text-center">
            <LoadingIcon className="text-4xl" />
          </div>
        ) : (
          <Component {...props} />
        )}
      </>
    );
  };
});
export const TabCardExplain = run(() => {
  const Component = creatorComponent(CARD_TYPE.explain);

  return ({ isLoading, ...props }) => {
    return (
      <>
        {isLoading ? (
          <div className="text-center">
            <LoadingIcon className="text-4xl" />
          </div>
        ) : (
          <Component {...props} />
        )}
      </>
    );
  };
});
