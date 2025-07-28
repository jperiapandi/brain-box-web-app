import type { Timestamp } from "firebase/firestore";
import type { QuestionModel } from "./questionTypes";

export type Draft = {
  id: string;
  title: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  questions: QuestionModel[];
};
