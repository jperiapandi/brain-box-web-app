import type { FieldValue } from "firebase/firestore";
import type { QuestionModel } from "./questionTypes";

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
};
