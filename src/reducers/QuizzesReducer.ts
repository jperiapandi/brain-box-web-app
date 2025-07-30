import type { QuizItem } from "../types/quiz";
// import type { AnyActionArg } from "react";
export const SET_QUIZZES = "setQuizzes";
export const SET_QUIZZES_TO_EMPTY = "setQuizzesToEmpty";

export type QuizzesAction = {
  type: string;
  quizzes?: QuizItem[];
};

const quizzesReducer: React.Reducer<QuizItem[], QuizzesAction> = (
  prevState,
  action
) => {
  console.log(`quizzesReducer -> Action: ${action.type}`);
  let updatedState: QuizItem[] = prevState;

  switch (action.type) {
    case SET_QUIZZES:
      updatedState = action.quizzes ?? [];
      break;
    case SET_QUIZZES_TO_EMPTY:
      updatedState = [];
      break;
  }

  return updatedState;
};

export default quizzesReducer;
