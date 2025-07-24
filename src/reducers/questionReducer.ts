import type React from "react";
import type { QuestionModel } from "../types/questionTypes";

export const CHANGE_Q_TYPE = "change-question-type";
export const CHANGE_Q_TEXT = "change-question-text";

type QuestionAction = {
  type: string;
  questionType?: string;
  questionText?: string;
};

const questionReducer: React.Reducer<QuestionModel, QuestionAction> = (
  prevState,
  action
) => {
//   console.log(`${action.type}`);
  switch (action.type) {
    case CHANGE_Q_TYPE:
      if (action.questionType != undefined || action.questionType != null) {
        return {
          ...prevState,
          type: action.questionType,
        };
      }
      break;
    case CHANGE_Q_TEXT:
      if (action.questionText != undefined || action.questionText != null) {
        return {
          ...prevState,
          questionText: action.questionText,
        };
      }
      break;
    default:
      console.error(new Error(`Unknown QuestionAction '${action.type}'`));
  }
  return prevState;
};

export default questionReducer;
