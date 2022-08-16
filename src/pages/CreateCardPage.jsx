import React, { useCallback } from "react";
import FileUpLoad from "../components/FileUpLoad";
import PageTab from "../components/PageTab";

const CreateCardPage = () => {
  const handleNext = useCallback((tabKey) => {
    console.log(tabKey);

    return true;
  }, []);

  const handlePrev = useCallback((tabKey) => {
    console.log(tabKey);
  }, []);

  return (
    <PageTab
      defaultActive={"question"}
      typeStep={true}
      onNext={handleNext}
      onPrev={handlePrev}
    >
      <PageTab.Title tabKey="question">Question card</PageTab.Title>
      <PageTab.Title tabKey="answer">Answer card</PageTab.Title>
      <PageTab.Title tabKey="explain">Explain card</PageTab.Title>
      <PageTab.Content tabKey="question">
        <div>
          <FileUpLoad />
          <textarea
            className="mt-4"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Detail..."
          ></textarea>
        </div>
      </PageTab.Content>
      <PageTab.Content tabKey="answer">
        <div>
          <FileUpLoad />
          <textarea
            className="mt-4"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Detail..."
          ></textarea>
        </div>
      </PageTab.Content>
      <PageTab.Content tabKey="explain">
        <div>
          <FileUpLoad />
          <textarea
            className="mt-4"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Detail..."
          ></textarea>
        </div>
      </PageTab.Content>
    </PageTab>
  );
};

export default CreateCardPage;
