import React, { useCallback, useState } from "react";
import FastCreateOrSelectGroup from "../components/FastCreateOrSelectGroup";
import FileUpLoad from "../components/FileUpLoad";
import PageTab from "../components/PageTab";
import { run } from "../functions/common";

const CARD_TYPE = {
  card_group: "card_group",
  question: "question",
  answer: "answer",
  explain: "explain",
};

const useFormData = run(() => {
  return () => {
    const [data, setData] = useState(() => {
      return Object.keys(CARD_TYPE).reduce((acc, key) => {
        acc[key] = {
          fileImage: null,
          detail: "",
        };

        return acc;
      }, {});
    });

    return {
      getData: (tab, field) => data[tab][field],
      setData: (tab, field, value) => {
        setData((prev) => {
          if (prev[tab][field] === value) return prev;

          return {
            ...prev,
            [tab]: {
              ...prev[tab],
              [field]: value,
            },
          };
        });
      },
    };
  };
});

const CreateCardPage = () => {
  const { getData, setData } = useFormData();
  const handleNext = useCallback((tabKey) => {
    console.log(tabKey);

    return true;
  }, []);

  const handlePrev = useCallback((tabKey) => {
    console.log(tabKey);
    return true;
  }, []);

  return (
    <PageTab
      defaultActive={CARD_TYPE.card_group}
      typeStep={true}
      onNext={handleNext}
      onPrev={handlePrev}
    >
      <PageTab.Title tabKey={CARD_TYPE.card_group}>
        Select card group
      </PageTab.Title>
      <PageTab.Title tabKey={CARD_TYPE.question}>Question card</PageTab.Title>
      <PageTab.Title tabKey={CARD_TYPE.answer}>Answer card</PageTab.Title>
      <PageTab.Title tabKey={CARD_TYPE.explain}>Explain card</PageTab.Title>
      <PageTab.Content tabKey={CARD_TYPE.card_group}>
        <FastCreateOrSelectGroup></FastCreateOrSelectGroup>
      </PageTab.Content>
      <PageTab.Content tabKey={CARD_TYPE.question}>
        <div>
          <FileUpLoad
            croppedImage={getData(CARD_TYPE.question, "fileImage")}
            setCroppedImage={(value) => {
              console.log(value);
              setData(CARD_TYPE.question, "fileImage", value);
            }}
          />
          <textarea
            className="mt-4"
            name=""
            id=""
            cols="30"
            rows="10"
            value={getData(CARD_TYPE.question, "detail")}
            onChange={(e) =>
              setData(CARD_TYPE.question, "detail", e.target.value)
            }
            placeholder="Detail..."
          ></textarea>
        </div>
      </PageTab.Content>
      <PageTab.Content tabKey={CARD_TYPE.answer}>
        <div>
          <FileUpLoad
            croppedImage={getData(CARD_TYPE.answer, "fileImage")}
            setCroppedImage={(value) =>
              setData(CARD_TYPE.answer, "fileImage", value)
            }
          />
          <textarea
            className="mt-4"
            name=""
            id=""
            cols="30"
            rows="10"
            value={getData(CARD_TYPE.answer, "detail")}
            onChange={(e) =>
              setData(CARD_TYPE.answer, "detail", e.target.value)
            }
            placeholder="Detail..."
          ></textarea>
        </div>
      </PageTab.Content>
      <PageTab.Content tabKey={CARD_TYPE.explain}>
        <div>
          <FileUpLoad
            croppedImage={getData(CARD_TYPE.explain, "fileImage")}
            setCroppedImage={(value) =>
              setData(CARD_TYPE.explain, "fileImage", value)
            }
          />
          <textarea
            className="mt-4"
            name=""
            id=""
            cols="30"
            rows="10"
            value={getData(CARD_TYPE.explain, "detail")}
            onChange={(e) =>
              setData(CARD_TYPE.explain, "detail", e.target.value)
            }
            placeholder="Detail..."
          ></textarea>
        </div>
      </PageTab.Content>
    </PageTab>
  );
};

export default CreateCardPage;
