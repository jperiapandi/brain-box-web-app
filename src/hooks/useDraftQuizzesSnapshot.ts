import { useContext, useState } from "react";
import { QUIZ_STATUS_DRAFT, QUIZ_STATUS_SUBMITTED } from "../types/quizDraft";
import {
  collection,
  type DocumentData,
  getFirestore,
  onSnapshot,
  Query,
  query,
  QueryDocumentSnapshot,
  type Unsubscribe,
  where,
} from "firebase/firestore";
import {
  COLXN_QUIZ_DRAFTS,
  FIELD_AUTHOR_UID,
  FIELD_STATUS,
} from "../types/constants";
import { UserContext } from "../contexts/UserContext";
import { ClaimsContext } from "../contexts/ClaimsContext";

const useDraftQuizzesSnapshot = () => {
  const user = useContext(UserContext);
  const claims = useContext(ClaimsContext);

  const [isProgress, setIsProgress] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [quizDrafts, setQuizDrafts] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);

  let snapshotUnsubs: Unsubscribe;

  function load(status = QUIZ_STATUS_DRAFT) {
    if (snapshotUnsubs != undefined) {
      snapshotUnsubs();
    }
    setIsProgress(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setQuizDrafts([]);

    if (user == null) {
      setIsError(true);
      setError(new Error(`Access denied.`));
      return;
    }
    if (status === QUIZ_STATUS_SUBMITTED && claims?.admin !== true) {
      setIsError(true);
      setError(new Error(`Access denied.`));
      return;
    }

    let q: Query<DocumentData, DocumentData>;
    switch (status) {
      case QUIZ_STATUS_SUBMITTED:
        if (claims?.admin === true || claims?.superAdmin === true) {
          q = query(
            collection(getFirestore(), COLXN_QUIZ_DRAFTS),
            where(FIELD_STATUS, "==", status)
          );
        } else {
          setIsError(true);
          setError(new Error(`Access denied.`));
          return;
        }
        break;
      default:
        q = query(
          collection(getFirestore(), COLXN_QUIZ_DRAFTS),
          where(FIELD_AUTHOR_UID, "==", user.uid),
          where(FIELD_STATUS, "==", status)
        );
        break;
    }
    //
    snapshotUnsubs = onSnapshot(q, {
      next: (snapshot) => {
        if (snapshot.empty) {
          //No data docs in Firestore
        } else {
          setIsProgress(false);
          setIsSuccess(true);
          setQuizDrafts(snapshot.docs);
        }
      },
      error: (error) => {
        setIsError(true);
        setError(error);
      },
    });
  }
  const quizLoader = {
    load,
    isProgress,
    isSuccess,
    isError,
    error,
    quizDrafts,
  };

  return [quizLoader];
};

export default useDraftQuizzesSnapshot;
