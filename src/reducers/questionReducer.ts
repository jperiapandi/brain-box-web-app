import type React from "react";
import type { QuestionModel } from "../types/questionTypes";

type QuestionAction = {
  type: string;
};

const questionReducer: React.Reducer<QuestionModel, QuestionAction> = (
  prevState,
  action
) => {
  let updatedQuestion: QuestionModel = { ...prevState };

  switch (action.type) {
    default:
      throw new Error(`Unknown QuestionAction '${action.type}'`);
  }
  return updatedQuestion;
};

export default questionReducer;
