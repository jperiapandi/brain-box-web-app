import type React from "react";
import {
  createDefaultQuestion,
  type QuestionModel,
} from "../types/questionTypes";

export const CREATE_QUESTION = "add-question";
export const REMOVE_QUESTION = "remove-question";
export const UPDATE_QUESTION = "update-question-type";

type QuestionListAction = {
  type: string;
  id?: string;
  question?: QuestionModel;
};

const questionListReducer: React.Reducer<
  QuestionModel[],
  QuestionListAction
> = (prevState, action) => {
  // console.log(action.type, action.id, action.question);

  let updatedQuestions: QuestionModel[] = [];
  switch (action.type) {
    case CREATE_QUESTION:
      {
        //Create a new Question Object and add it to the list of questions.
        const n = createDefaultQuestion();
        updatedQuestions = [...prevState, n];
      }
      break;
    case REMOVE_QUESTION:
      {
        updatedQuestions = prevState.filter((q) => {
          return q.id != action.id;
        });
      }
      break;
    case UPDATE_QUESTION:
      {
        const id = action.id;
        const question = action.question;
        if (!id || !question) {
          throw new Error(`Can not update question.`);
        }

        updatedQuestions = prevState.map((q) => {
          if (q.id == id) {
            return question;
          } else {
            return q;
          }
        });
      }
      break;
    default:
      throw new Error(`Unknown QuestionsReducer Action '${action.type}'`);
  }
  return updatedQuestions;
};

export default questionListReducer;
