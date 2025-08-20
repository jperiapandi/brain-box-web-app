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
  isAnonymous: boolean;
};

//Firestore path /quizzes/{quizId}/participants/{doc}
export type QuizParticipant = Participant & {
  participatedAt: Timestamp;
  score: number;
};
