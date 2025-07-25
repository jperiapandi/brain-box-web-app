import type React from "react";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  type Answer,
  type QuestionModel,
} from "../types/questionTypes";

export const CHANGE_Q_TYPE = "change-question-type";
export const CHANGE_Q_TEXT = "change-question-text";
export const CHANGE_ANS_TEXT = "change-answer-text";
export const CHANGE_ANS_CHECKED = "change-answer-checked";

type QuestionAction = {
  type: string;
  questionType?: string;
  questionText?: string;
  //
  ansId?: string;
  ansText?: string;
  checked?: boolean;
};

const questionReducer: React.Reducer<QuestionModel, QuestionAction> = (
  prevState,
  action
) => {
    // console.log(`${action.type}`);
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
        if (action.questionText !== prevState.questionText) {
          return {
            ...prevState,
            questionText: action.questionText,
          };
        }
      }
      break;
    case CHANGE_ANS_TEXT:
      {
        const { ansId, ansText } = action;
        const prevAns = prevState.answersMap[prevState.type];
        const updatedAnswers = prevAns.map((ans) => {
          if (ans.id == ansId) {
            return {
              ...ans,
              value: ansText,
            } as Answer;
          }
          return ans;
        });
        const updatedAnswersMap = { ...prevState.answersMap };
        updatedAnswersMap[prevState.type] = updatedAnswers;
        const updatedState: QuestionModel = {
          ...prevState,
          answersMap: updatedAnswersMap,
        };
        return updatedState;
      }
      break;
    case CHANGE_ANS_CHECKED:
      {
        const { ansId, checked } = action;
        const prevAns = prevState.answersMap[prevState.type];
        let updatedAnswers: Answer[];
        if (prevState.type === Q_TYPE_CHOOSE_MULTIPLE) {
          //Multi choice option
          updatedAnswers = prevAns.map((ans) => {
            if (ans.id == ansId) {
              return { ...ans, checked: checked === true };
            } else {
              return ans;
            }
          });
        } else {
          //Single choice option
          updatedAnswers = prevAns.map((ans) => {
            const uAns = { ...ans };
            uAns.checked = false;
            if (uAns.id == ansId) {
              uAns.checked = checked == true;
            }
            return uAns;
          });
        }
        const updatedAnswersMap = { ...prevState.answersMap };
        updatedAnswersMap[prevState.type] = updatedAnswers;
        const updatedState: QuestionModel = {
          ...prevState,
          answersMap: updatedAnswersMap,
        };
        return updatedState;
      }
      break;
    default:
      console.error(new Error(`Unknown QuestionAction '${action.type}'`));
  }
  return prevState;
};

export default questionReducer;
