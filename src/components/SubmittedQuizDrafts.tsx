import type React from "react";
import useDraftQuizzesSnapshot from "../hooks/useDraftQuizzesSnapshot";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { QUIZ_STATUS_SUBMITTED } from "../types/quizDraft";

const SubmittedQuizDrafts: React.FunctionComponent = () => {
  const user = useContext(UserContext);
  const [quizDraftsSnapshot] = useDraftQuizzesSnapshot();

  useEffect(() => {
    if (user != null) {
      quizDraftsSnapshot.load(QUIZ_STATUS_SUBMITTED);
    }
  }, []);

  return (
    <>
      <h3>List of Submitted Quizzes for you to review</h3>

      {quizDraftsSnapshot.quizDrafts.map((doc) => {
        let authorName = doc.get("author");
        if (doc.get("author_uid") === user?.uid) {
          authorName = "You";
        }

        return (
          <div className="submitted-list-item" key={doc.id}>
            <div>{doc.get("title")}</div>
            <div>
              <div className="author-label">Author:</div>
              <div>{authorName}</div>
            </div>
            <button className="btn btn-primary">Review</button>
          </div>
        );
      })}
    </>
  );
};

export default SubmittedQuizDrafts;
