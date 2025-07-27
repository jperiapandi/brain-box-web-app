import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
  type DocumentData,
} from "firebase/firestore";
import type React from "react";
import { useContext, useEffect, useState, type PropsWithChildren } from "react";

import { UserContext } from "../contexts/UserContext";

type QuizDraftsListProps = PropsWithChildren & {
  onEdit: (quizDraftId: string) => void;
};

const QuizDraftsList: React.FunctionComponent<QuizDraftsListProps> = () => {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);

  useEffect(() => {
    //Load Drafts from Firebase
    if (user) {
      setLoading(true);
      const q = query(
        collection(getFirestore(), "quiz-drafts"),
        where("author_uid", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, {
        next: (snapshot) => {
          setLoading(false);
          if (snapshot.empty) {
            //No data in Firebase
            return;
          }
          setDrafts(snapshot.docs);
        },
        error: (error) => {
          console.error(error);
          setLoading(false);
        },
      });

      return () => {
        unsubscribe();
      };
    } else {
      setLoading(false);
      setDrafts([]);
    }
  }, [user]);

  //TODO - Move the following function to a separate js file
  function getFormattedDate(timestamp: Timestamp) {
    if (!timestamp) {
      return "";
    }
    if (isNaN(timestamp.toDate().getTime())) {
      return "";
    }
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (drafts.length == 0) {
    return null;
  }

  return (
    <section className="section-quiz-drafts">
      {loading ? (
        <div>Loading data.. please wait</div>
      ) : (
        <>
          <h1 className="section-title">Quiz Drafts - created by you.</h1>

          <div className="drafts-list">
            {drafts.map((draft) => {
              return (
                <div key={draft.id} className="draft-item">
                  <h1>{draft.get("title")}</h1>

                  <div className="label-value-pair">
                    <span>Created:</span>
                    <span>
                      {getFormattedDate(draft.get("createdAt") as Timestamp)}
                    </span>
                  </div>
                  <div className="label-value-pair">
                    <span>Last updated:</span>
                    <span>
                      {getFormattedDate(draft.get("updatedAt") as Timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default QuizDraftsList;
