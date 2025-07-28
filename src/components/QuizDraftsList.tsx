import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
  type DocumentData,
} from "firebase/firestore";
import type React from "react";
import { useContext, useEffect, useState, type PropsWithChildren } from "react";

import { UserContext } from "../contexts/UserContext";
import DraftListItem from "./DraftListItem";
import type { Draft } from "../types/draft";

type QuizDraftsListProps = PropsWithChildren & {
  onEdit: (quizDraftId: string) => void;
};

const QuizDraftsList: React.FunctionComponent<QuizDraftsListProps> = ({
  onEdit,
}) => {
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

  if (user == null) {
    return null;
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
            {drafts.map((draftDoc) => {
              const draft = draftDoc.data() as Draft;
              return (
                <DraftListItem
                  key={draftDoc.id}
                  title={draft.title}
                  createdAt={draft.createdAt}
                  updatedAt={draft.updatedAt}
                  status={draft.status}
                  onEditClick={(evt) => {
                    evt.stopPropagation();
                    onEdit(draftDoc.id);
                  }}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default QuizDraftsList;
