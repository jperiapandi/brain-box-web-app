import type { Timestamp } from "firebase/firestore";
import type { QuestionEvaluated } from "./quiz";

//Firebase Doc
export type Participation = {
  docId?: string;
  participant: Participant;
  participatedAt: Timestamp;
  quizId: string;
  quizTitle: string;
  questionsEvaluated: QuestionEvaluated[];
  scoreSum: number;
};

export type Participant = {
  displayName: string;
  uid: string;
};
