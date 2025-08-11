import type { FieldValue, Timestamp } from "firebase/firestore";
import type {
  QuestionOption,
  QuestionReview,
  QuestionRunnerView,
} from "./questionTypes";

export type QuizDoc = {
  title: string;
  desc: string;
  author: string;
  isAnonymous: boolean;

  approved: boolean;
  approvedAt: FieldValue;
  approver: string;
  approver_uid: string;

  questions: QuestionOption[];
};

export type QuizRunner = {
  questions: QuestionRunnerView[];
};

export type QuizItem = {
  id: string;
  title: string;
  desc: string;
  author: string;
  approvedAt: Timestamp;
};

export type QuizReview = {
  title: string;
  desc: string;
  author: string;
  isAnonymous: boolean;
  createdAt: Timestamp;
  submittedAt: Timestamp;
  questions: QuestionReview[];
};

export type EvaluateQuizResponse = {
  quizId: string;
  scoreSum: number;
  participant: {
    uid: string;
    displayName: string;
  };
  questionsEvaluated: QuestionEvaluated[];
};

export type QuestionEvaluated = Omit<QuestionOption, "availableAnswers"> & {
  userAttempted: boolean;
  score: number;
  evaluatedOptions: EvaluatedOption[];
};

export type EvaluatedOption = {
  label: string;
  userChecked: boolean;
  correct: boolean;
};