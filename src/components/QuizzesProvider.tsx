import { useEffect, useReducer, type PropsWithChildren } from "react";
import type React from "react";
import { QuizzesContext } from "../contexts/QuizzesContext";
import quizzesReducer, {
  SET_QUIZZES,
  SET_QUIZZES_TO_EMPTY,
} from "../reducers/QuizzesReducer";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { QuizItem } from "../types/quiz";

const QuizzesProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [quizzes, dispatch] = useReducer(quizzesReducer, []);

  useEffect(() => {
    //Load quizzes from backend

    console.log(`START listening for Quizzes collection`);

    const q = query(
      collection(getFirestore(), "quizzes"),
      where("approved", "==", true)
    );
    const unsubscribe = onSnapshot(q, {
      next: (querySnapshot) => {
        if (querySnapshot.empty) {
          //No data in DB
          dispatch({
            type: SET_QUIZZES_TO_EMPTY,
          });
        } else {
          //Quizzes loaded successfully

          const result: QuizItem[] = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              title: doc.get("title"),
              desc: doc.get("desc"),
              author: doc.get("author"),
              approvedAt: doc.get("approvedAt"),
            };
          });

          dispatch({
            type: SET_QUIZZES,
            quizzes: result,
          });
        }
      },
      error: (err) => {
        console.error(err);

        dispatch({
          type: SET_QUIZZES_TO_EMPTY,
        });
      },
    });

    //Return a cleanup function
    return () => {
      console.log(`STOP listening for Quizzes collection`);

      unsubscribe();
    };
  }, []);

  //

  return (
    <>
      <QuizzesContext value={quizzes}>{children}</QuizzesContext>
    </>
  );
};

export default QuizzesProvider;
