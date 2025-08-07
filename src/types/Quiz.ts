import type { FieldValue, Timestamp } from "firebase/firestore";
import type {
  QuestionQuizView,
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

  questions: QuestionQuizView[];
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
