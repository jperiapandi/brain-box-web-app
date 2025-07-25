import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import type React from "react";
import { useEffect, useState, type MouseEventHandler } from "react";
import { CREATE_QUIZ_PAGE_PATH } from "../routes/router";
import { useNavigate } from "react-router";

const QuizDraftsList: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);

  useEffect(() => {
    //Load Drafts from Firebase

    const q = query(collection(getFirestore(), "quiz-drafts"));
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
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleCreateQuizClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    navigate(CREATE_QUIZ_PAGE_PATH);
  };

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

          <div>
            <button onClick={handleCreateQuizClick} className="btn btn-primary">
              Create a Quiz
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default QuizDraftsList;
