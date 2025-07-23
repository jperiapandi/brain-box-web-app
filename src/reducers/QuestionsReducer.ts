import type React from "react";
import type { QuestionModel } from "../types/questionTypes";

export const ADD_QUESTION = "add-question";
export const REMOVE_QUESTION = "remove-question";

type QuestionsAction = {
  type: string;
  question?: QuestionModel;
  id?: string;
};

const questionsReducer: React.Reducer<QuestionModel[], QuestionsAction> = (
  prevState,
  action
) => {
  let updatedQuestions: QuestionModel[] = [];
  switch (action.type) {
    case ADD_QUESTION:
      {
        if (action.question) {
          updatedQuestions = [...prevState, action.question];
        }
      }
      break;
    case REMOVE_QUESTION:
      {
        updatedQuestions = prevState.filter((q) => {
          return q.id != action.id;
        });
      }
      break;
    default:
      throw new Error(`Unknown QuestionsReducer Action '${action.type}'`);
  }
  return updatedQuestions;
};

export default questionsReducer;
