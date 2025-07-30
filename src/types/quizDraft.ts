import type { FieldValue } from "firebase/firestore";
import type { QuestionModel } from "./questionTypes";

export const QUIZ_STATUS_NEW = "new";
export const QUIZ_STATUS_DRAFT = "draft";
export const QUIZ_STATUS_SUBMITTED = "submitted";
export const QUIZ_STATUS_APPROVED = "approved";
export const QUIZ_STATUS_REJECTED = "rejected";

export type QuizDraft = {
  title: string;
  desc: string;
  author: string;
  author_uid: string;
  isAnonymous: boolean;
  status: string;
  questions: QuestionModel[];

  createdAt?: FieldValue;
  updatedAt?: FieldValue;
  submittedAt?: FieldValue;
};
