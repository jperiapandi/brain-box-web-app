import React from "react";
import type { Answer } from "../types/questionTypes";

export const UPDATE_NEW_ANSWERS_LIST = "update_new_answers_list";
export const ANS_UPDATE_VALUE = "update_ans_text_value";

type AnswerAction = {
  type: string;
  id: string; //Answer uuid
  textToUpdate?: string;
  answers?: Answer[];
};

const answersReducer: React.Reducer<Answer[], AnswerAction> = (
  prevState,
  action
) => {
  console.log(action.type, action.textToUpdate);

  switch (action.type) {
    case UPDATE_NEW_ANSWERS_LIST:
      if (action.answers) {
        return action.answers;
      }
      break;
    case ANS_UPDATE_VALUE:
      return prevState.map((ans) => {
        if (ans.id === action.id && action.textToUpdate) {
          return {
            ...ans,
            value: action.textToUpdate,
          };
        } else {
          return ans;
        }
      });
      break;
    default:
      console.error(new Error(`Unknown AnswerAction ${action.type}`));
      break;
  }
  return prevState;
};
export default answersReducer;
