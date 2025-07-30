import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { ApiLoader } from "../types/apiLoader";

import { COLXN_QUIZ_DRAFTS } from "../types/constants";
import type { QuizDraft } from "../types/quizDraft";
import type { QuestionReview } from "../types/questionTypes";
import type { QuizReview } from "../types/quiz";

export default function useReviewQuizLoader(docId: string): ApiLoader<QuizReview> {
  const [progress, setProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<QuizReview>();

  useEffect(() => {
    if (docId && docId != "") {
      //Start loading the document
      setProgress(true);
      setSuccess(false);
      setFailure(false);
      setError(undefined);
      //
      const docRef = doc(getFirestore(), COLXN_QUIZ_DRAFTS, docId);
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            //Calculate the data
            const docData = snapshot.data() as QuizDraft;

            const questions: QuestionReview[] = docData.questions.map((q) => {
              const answers = q.answersMap[q.type];
              return {
                id: q.id,
                questionText: q.questionText,
                type: q.type,
                answers,
              };
            });

            const quizReview: QuizReview = {
              author: docData.author,
              isAnonymous: docData.isAnonymous,
              title: docData.title,
              desc: docData.desc,
              createdAt: snapshot.get("createdAt"),
              submittedAt: snapshot.get("submittedAt"),
              questions: questions,
            };
            setProgress(false);
            setSuccess(true);
            setData(quizReview);
          }
        })
        .catch((error) => {
          console.error(error);

          setProgress(false);
          setFailure(true);
          setError(error);
          setData(undefined);
        });
    }
  }, [docId]);

  const result: ApiLoader<QuizReview> = {
    progress,
    failure,
    success,
    error,
    data,
  };

  return result;
}
