import { useEffect, useReducer, type PropsWithChildren } from "react";
import type React from "react";
import { QuizzesContext } from "../contexts/QuizzesContext";
import quizzesReducer, {
  SET_QUIZZES,
  SET_QUIZZES_TO_EMPTY,
} from "../reducers/QuizzesReducer";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import type { Quiz } from "../types/Quiz";

const QuizzesProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [quizzes, dispatch] = useReducer(quizzesReducer, []);

  useEffect(() => {
    //Load quizzes from backend
    (async () => {
      try {
        console.log(`Start loading quizzes from Firestore`);

        const q = query(
          collection(getFirestore(), "quizzes"),
          where("approved", "==", true)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          //No data in DB
          dispatch({
            type: SET_QUIZZES_TO_EMPTY,
          });
        } else {
          //Quizzes loaded successfully
          const result: Quiz[] = [];
          querySnapshot.forEach((doc) => {
            result.push({
              ...doc.data(),
              id: doc.id,
            } as Quiz);
          });

          dispatch({
            type: SET_QUIZZES,
            quizzes: result,
          });
        }
      } catch (err) {}
    })();
  }, []);

  //

  return (
    <>
      <QuizzesContext value={quizzes}>{children}</QuizzesContext>
    </>
  );
};

export default QuizzesProvider;
