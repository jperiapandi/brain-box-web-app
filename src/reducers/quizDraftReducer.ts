import type React from "react";
import type { QuizDraft } from "../types/quizDraft";
import type { QuestionModel } from "../types/questionTypes";

export const DRAFT_CHANGE_TITLE = "draft-change-title";
export const DRAFT_CHANGE_DESC = "draft-change-desc";
export const DRAFT_ADD_QUESTION = "draft-add-question";
export const DRAFT_UPDATE_QUESTION = "draft-update-question";
export const DRAFT_REMOVE_QUESTION = "draft-remove-question";
export const DRAFT_CHANGE_STATUS = "draft-update-status";

type QuizDraftAction = {
  type: string;
  //
  dataToUpdate: {
    title?: string;
    desc?: string;
    question?: QuestionModel;
    questionId?: string;
    status?: string;
  };
};
const quizDraftReducer: React.Reducer<QuizDraft, QuizDraftAction> = (
  prevState,
  action
) => {
  let updatedState: QuizDraft;
  const { title, desc, question, questionId, status } = action.dataToUpdate;
  // console.log(`QuizDraftAction : ${action.type}`);

  switch (action.type) {
    case DRAFT_CHANGE_TITLE:
      {
        if (title === undefined || title === null) {
          throw new Error(
            `title value is missing. Can not perform QuizDraftAction.`
          );
        }
        updatedState = {
          ...prevState,
          title,
        };
      }
      break;
    case DRAFT_CHANGE_DESC:
      {
        if (desc === undefined || desc === null) {
          throw new Error(
            `desc value is missing. Can not perform QuizDraftAction.`
          );
        }
        updatedState = {
          ...prevState,
          desc,
        };
      }
      break;
    case DRAFT_ADD_QUESTION:
      {
        if (!question) {
          throw new Error(
            `question value is missing. Can not perform QuizDraftAction. ${action.type}`
          );
        }
        const updatedQuestions = [...prevState.questions, question];
        updatedState = {
          ...prevState,
          questions: updatedQuestions,
        };
      }
      break;
    case DRAFT_UPDATE_QUESTION:
      {
        if (!question) {
          throw new Error(
            `question value is missing. Can not perform QuizDraftAction.`
          );
        }
        const updatedQuestions = prevState.questions.map((q) => {
          if (q.id == question.id) {
            return question;
          }
          return q;
        });
        updatedState = {
          ...prevState,
          questions: updatedQuestions,
        };
      }
      break;
    case DRAFT_REMOVE_QUESTION:
      {
        if (!questionId) {
          throw new Error(
            `questionId value is missing. Can not perform QuizDraftAction.`
          );
        }
        const updatedQuestions = prevState.questions.filter((q) => {
          return q.id !== questionId;
        });
        updatedState = {
          ...prevState,
          questions: updatedQuestions,
        };
      }
      break;
    case DRAFT_CHANGE_STATUS:
      {
        if (!status) {
          throw new Error(
            `status value is missing. Can not perform QuizDraftAction. ${action.type}`
          );
        }
        updatedState = {
          ...prevState,
          status,
        };
      }
      break;
    default:
      console.error(`Unknown QuizDraftAction '${action.type}'`);
      updatedState = prevState;
      break;
  }
  return updatedState;
};

export default quizDraftReducer;
