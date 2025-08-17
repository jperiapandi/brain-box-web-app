import { useEffect, useState } from "react";
import { type QuizItem } from "../types/quiz";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { COLXN_QUIZZES } from "../types/constants";

const useQuizzesSnapshot = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setQuizzes([]);

    console.log(`START listening for Quizzes Collection.`);

    const q = query(
      collection(getFirestore(), COLXN_QUIZZES),
      where("approved", "==", true),
      orderBy("approvedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        if (snapshot.empty) {
          setError(new Error(`No Quizzes found in Firebase.`));
        } else {
          const result: QuizItem[] = snapshot.docs.map((doc) => {
            const quizItem = {
              ...(doc.data() as QuizItem),
              id: doc.id,
            };
            // console.log(quizItem);

            return quizItem;
          });

          setQuizzes(result);
        }

        setLoading(false);
      },
      error: (err) => {
        setError(
          new Error(`Sorry, something went wrong. Please try again later.`, {
            cause: err,
          })
        );
        setLoading(false);
        console.error(err);
      },
    });

    return () => {
      console.log(`STOP listening for Quizzes Collection.`);
      unsubscribe();
    };
  }, []);

  //
  return {
    loading,
    error,
    quizzes,
  };
};

export default useQuizzesSnapshot;
